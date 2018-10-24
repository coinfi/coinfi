import * as React from 'react'
import * as _ from 'lodash'
import { Typography, Grid } from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'
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
  coinData: CoinDominance[]
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
      maxWidth: '240px',
    },
  })

class MarketDominance extends React.Component<Props, {}> {
  public chart: any

  public formatPercentage(percentage) {
    return parseFloat((percentage * 100).toFixed(1))
  }

  public componentDidMount() {
    const { coinData } = this.props

    const data = coinData.map((coin) => {
      return [coin.name, this.formatPercentage(coin.market_percentage)]
    })

    const bitcoinData = _.find(coinData, (coin) => coin.slug === 'bitcoin') || {
      market_percentage: 0,
    }

    this.chart = Highcharts.chart(
      containerId,
      _.merge(options, {
        chart: {
          type: 'pie',
          width: null,
          height: '100%',
        },
        colors: chartColours,
        title: {
          text: `${this.formatPercentage(bitcoinData.market_percentage)}%`,
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
            name: 'Browsers',
            data,
            size: '100%',
            innerSize: '90%',
            showInLegend: false,
            dataLabels: {
              enabled: false,
            },
          },
        ],
      }),
    )
  }

  public componentWillUnmount() {
    this.chart.destroy()
  }

  public render() {
    const { classes, coinData } = this.props

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

export default withStyles(styles)(MarketDominance)
