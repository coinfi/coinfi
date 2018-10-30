import * as React from 'react'
import * as _ from 'lodash'
import compose from 'recompose/compose'
import { Typography, Grid } from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth'
import BulletSpacer from '~/bundles/common/components/BulletSpacer'
import Highcharts from 'highcharts/highcharts'
import options from '../common/components/CoinCharts/PriceGraph/options'

enum STATUSES {
  INITIALIZING = 'INITIALIZING',
  LOADING = 'LOADING',
  READY = 'READY',
}

interface CoinDominance {
  id: number
  name: string
  symbol: string
  slug: string
  price_usd: number
  market_percentage: number
}

interface Props {
  classes: any
  width: any
  coinData: CoinDominance[]
}

interface State {
  chartData: any
  marketDominance: number
}

const containerId = 'market-dominance-chart'
const chartColours = ['#05161f', '#103649', '#135373', '#2495ce', '#2faeed']

const styles = (theme) =>
  createStyles({
    container: {
      border: '1px solid #e5e8ed',
      padding: `${theme.spacing.unit * 2}px`,
      paddingRight: `${theme.spacing.unit}px`, // smaller to compensate for chart's whitespace
    },
    chartContainer: {
      maxWidth: '200px',
    },
    legend: {
      flexBasis: 'unset !important', // fixes weird height issue
    },
    titleLabel: {
      color: '#d7d7d7',
      paddingRight: '5px',
    },
    title: {
      fontWeight: 600,
      display: 'inline-block',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.7rem',
        color: '#fff',
      },
    },
  })

class MarketDominance extends React.Component<Props, State> {
  public chart: any

  public constructor(props) {
    super(props)

    const chartData = props.coinData.map((coin) => {
      return [coin.name, this.formatPercentage(coin.market_percentage)]
    })

    const bitcoinData = _.find(
      props.coinData,
      (coin) => coin.slug === 'bitcoin',
    ) || {
      market_percentage: 0,
    }
    const marketDominance = bitcoinData.market_percentage

    this.state = {
      chartData,
      marketDominance,
    }
  }

  public componentDidMount() {
    if (isWidthUp('md', this.props.width)) {
      this.mountHighchart()
    }
  }

  public componentDidUpdate(prevProps, prevState) {
    if (
      isWidthUp('md', this.props.width) &&
      isWidthDown('sm', prevProps.width)
    ) {
      // switching from mobile to desktop
      this.mountHighchart()
    } else if (
      isWidthUp('md', prevProps.width) &&
      isWidthDown('sm', this.props.width)
    ) {
      // switching from desktop to mobile
      this.unmountHighchart()
    }
  }

  public componentWillUnmount() {
    this.unmountHighchart()
  }

  public mountHighchart() {
    const { chartData: data, marketDominance } = this.state

    this.unmountHighchart()

    this.chart = Highcharts.chart(
      containerId,
      _.merge(
        { ...options },
        {
          chart: {
            type: 'pie',
            width: null,
            height: '100%',
          },
          colors: chartColours,
          title: {
            text: `${this.formatPercentage(marketDominance)}%`,
            verticalAlign: 'middle',
            y: -7,
            style: { 'font-size': '1.5rem', 'font-weight': 'bold' },
          },
          subtitle: {
            text: 'Bitcoin Dominance',
            verticalAlign: 'middle',
            y: 10,
            style: { 'font-size': '0.75rem' },
          },
          plotOptions: {
            pie: {
              shadow: false,
            },
          },
          tooltip: {
            formatter() {
              return `<b>${this.point.name}</b> ${this.y}%`
            },
          },
          series: [
            {
              name: 'Coins',
              data,
              size: '100%',
              innerSize: '90%',
              showInLegend: false,
              dataLabels: {
                enabled: false,
              },
            },
          ],
        },
      ),
    )
  }

  public unmountHighchart() {
    if (this.chart) {
      this.chart.destroy()
      this.chart = undefined
    }
  }

  public formatPercentage(percentage) {
    return parseFloat((percentage * 100).toFixed(1))
  }

  public render() {
    const { classes, coinData, width } = this.props
    const { marketDominance } = this.state

    if (isWidthDown('sm', width)) {
      return (
        <React.Fragment>
          <Grid item={true} className={classes.title}>
            <Typography className={classes.titleLabel} component="span">
              Bitcoin Dominance:{' '}
            </Typography>
          </Grid>
          <Grid item={true} className={classes.title}>
            {this.formatPercentage(marketDominance)}%
          </Grid>
        </React.Fragment>
      )
    }

    return (
      <Grid
        container={true}
        justify="space-between"
        alignItems="stretch"
        className={classes.container}
      >
        <Grid item={true} xs={6}>
          <Grid
            container={true}
            direction="column"
            justify="flex-start"
            alignItems="stretch"
            className={classes.legend}
          >
            <Grid item={true}>
              <Typography variant="h5">Market Dominance</Typography>
            </Grid>
            {coinData.map((coin, index) => {
              const percentage = `${this.formatPercentage(
                coin.market_percentage,
              )}%`
              return (
                <Grid item={true} key={coin.id}>
                  <Grid
                    container={true}
                    justify="space-between"
                    alignItems="center"
                  >
                    <Grid item={true}>
                      <Typography component="span">
                        <BulletSpacer
                          fontSize={16}
                          styles={{ color: chartColours[index] }}
                        />
                        {index + 1}. {coin.name} {coin.symbol}
                      </Typography>
                    </Grid>
                    <Grid item={true}>
                      <Typography component="span">{percentage}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )
            })}
          </Grid>
        </Grid>
        <Grid item={true} xs={6} className={classes.chartContainer}>
          <div id={containerId} />
        </Grid>
      </Grid>
    )
  }
}

export default compose(
  withStyles(styles),
  withWidth(),
)(MarketDominance)
