import * as React from 'react'
import * as _ from 'lodash'
import compose from 'recompose/compose'
import { Typography, Grid } from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'
import withDevice, {
  DeviceContextType,
} from '~/bundles/common/utils/withDevice'
import BulletSpacer from '~/bundles/common/components/BulletSpacer'
import Highcharts from 'highcharts/highcharts'
import options from './CoinCharts/PriceGraph/options'

export interface CoinDominance {
  id: number
  name: string
  symbol: string
  slug: string
  price_usd: number
  market_percentage: number
}

interface Props extends DeviceContextType {
  classes: any
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
    desktopContainer: {
      background: '#fff',
      border: '1px solid #e5e8ed',
      borderRadius: '2px',
      padding: '16px 16px 16px 24px', // smaller right padding to compensate for chart's whitespace
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    mobileContainer: {},
    desktopTitle: {
      fontSize: '20px',
      fontWeight: 500,
    },
    chartContainer: {
      maxWidth: '200px',
    },
    legend: {
      flexBasis: 'unset !important', // fixes weird height issue
      height: '100%',
    },
    title: {
      [theme.breakpoints.down('sm')]: {
        whiteSpace: 'nowrap',
        color: '#d7d7d7',
        paddingRight: '5px',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '20px',
        fontWeight: 500,
        marginBottom: '10px',
      },
    },
    marketDominance: {
      display: 'inline-block',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.7rem',
        color: '#fff',
        fontWeight: 600,
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
    if (!this.props.isMobile) {
      this.mountHighchart()
    }
  }

  public componentDidUpdate(prevProps, prevState) {
    if (prevProps.isMobile && !this.props.isMobile) {
      // switching from mobile to desktop
      this.mountHighchart()
    } else if (!prevProps.isMobile && this.props.isMobile) {
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
            width: 200,
            height: 170,
            spacingTop: 0,
            spacingBottom: 0,
            spacingRight: 0,
          },
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
              type: 'pie',
              data,
              colors: chartColours,
              size: '100%',
              innerSize: '85%',
              showInLegend: false,
              dataLabels: {
                enabled: false,
              },
              center: ['50%', '50%'],
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
    const { classes, coinData, isDesktop } = this.props
    const { marketDominance } = this.state
    const isMobile = !isDesktop

    if (isMobile) {
      return (
        <Grid
          container={true}
          wrap="nowrap"
          alignItems="baseline"
          className={classes.mobileContainer}
        >
          <Grid item={true}>
            <Typography className={classes.title} component="span">
              Bitcoin Dominance:{' '}
            </Typography>
          </Grid>
          <Grid item={true} className={classes.marketDominance}>
            {this.formatPercentage(marketDominance)}%
          </Grid>
        </Grid>
      )
    }

    return (
      <Grid
        container={true}
        justify="space-between"
        alignItems="stretch"
        className={classes.desktopContainer}
      >
        <Grid item={true} xs={12}>
          <Typography variant="h2" className={classes.title}>
            Market Dominance
          </Typography>
        </Grid>
        <Grid item={true} xs={6}>
          <Grid
            container={true}
            direction="column"
            justify="space-around"
            alignItems="stretch"
            className={classes.legend}
          >
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
                        {index + 1}.{' '}
                        <a href={`/coins/${coin.slug}`}>
                          {coin.name} {coin.symbol}
                        </a>
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
        <Grid item={true} xs={4} className={classes.chartContainer}>
          <div id={containerId} />
        </Grid>
      </Grid>
    )
  }
}

export default compose(
  withStyles(styles),
  withDevice,
)(MarketDominance)
