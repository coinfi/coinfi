import * as React from 'react'
import * as _ from 'lodash'
import TokenChart from './TokenChart'
import { Grid, CardContent, Typography } from '@material-ui/core' // NOTE: We're not using custom CardContent since the relevant style changes are being overridden
import { withStyles } from '@material-ui/core/styles'
import {
  formatValue,
  formatValueFixed,
} from '~/bundles/common/utils/numberFormatters'
import SubCard from './SubCard'
import styles from './styles'

interface Props {
  classes: any
  tokenMetrics: TokenMetrics
  coinObj: CoinObj
}

interface TokenMetricProps {
  classes: any
  data: TokenData[]
  metaData: TokenMetaData
  coinObj: CoinObj
  tokenObj: TokenMetricObj
}

interface TokenMetricObj {
  title?: string
  yAxisLabel?: string
  metricSubtitle?: string
  dashboardLink: string
  isPercentage?: boolean
  titleFormatter?(coinObj: CoinObj): string
  yAxisLabelFormatter?(coinObj: CoinObj): string
  metricFormatter?(metricValue: number): string
  metricSubtitleFormatter?(coinObj: CoinObj): string
}

const TOKEN_METRIC_OBJ_DATA = {
  exchange_supply: {
    titleFormatter: (coinObj) => {
      const { symbol } = coinObj
      return `Percentage of ${symbol} on Exchanges`
    },
    yAxisLabel: '% Supply on Exchanges',
    metricSubtitle: 'Tokens held on exchanges',
    dashboardLink: '/token-metrics/supply-on-exchange',
  },
  token_retention_rate: {
    title: 'Percentage of Early Investors Still HODLing',
    yAxisLabel: '% Supply Held by Early Investors',
    metricSubtitle: 'Early investors still HODLing',
    dashboardLink: '/token-metrics/retention',
  },
  unique_wallet_count: {
    title: 'Unique Wallets HODLing Token',
    yAxisLabel: 'Wallets',
    isPercentage: false,
    metricFormatter: (metricValue) => formatValue(metricValue || 0, 0),
    metricSubtitle: 'Wallets',
    dashboardLink: '/token-metrics/adoption',
  },
  token_distribution_100: {
    title: 'Percentage of Tokens Held By Top 100 Wallets',
    yAxisLabel: '% Supply Held by Top 100 Wallets',
    metricSubtitle: 'Tokens held by top 100',
    dashboardLink: '/token-metrics/decentralization',
  },
  token_velocity: {
    title: 'Percentage of Supply Transacted on Blockchain',
    yAxisLabel: `% Supply Tx'd on Blockchain`,
    metricFormatter: (metricValue) =>
      `${formatValueFixed(metricValue || 0, 2)}%`,
    metricSubtitle: 'Of supply transacted yesterday',
    dashboardLink: '/token-metrics/velocity',
  },
}

function TokenMetric({
  classes,
  data,
  metaData,
  tokenObj,
  coinObj,
}: TokenMetricProps) {
  const { metric_value, rank, num_coins } = metaData
  const {
    title: titleString,
    yAxisLabel: yAxisLabelString,
    metricSubtitle: metricSubtitleString,
    dashboardLink,
    isPercentage = true,
    titleFormatter,
    yAxisLabelFormatter,
    metricFormatter,
    metricSubtitleFormatter,
  } = tokenObj

  const title = _.isFunction(titleFormatter)
    ? titleFormatter(coinObj)
    : titleString || ''
  const yAxisLabel = _.isFunction(yAxisLabelFormatter)
    ? yAxisLabelFormatter(coinObj)
    : yAxisLabelString || ''
  const metricText = _.isFunction(metricFormatter)
    ? metricFormatter(metric_value)
    : `${formatValueFixed(metric_value || 0, 1)}%`
  const metricSubtitle = _.isFunction(metricSubtitleFormatter)
    ? metricSubtitleFormatter(coinObj)
    : metricSubtitleString || ''
  const rankText = `#${formatValue(rank || 0, 0)}`
  const rankSubtitle = `Rank out of ${formatValue(num_coins || 0, 0)} coins`

  return (
    <>
      <Grid item={true} xs={12} className={classes.tokenMetricHeader}>
        <Typography variant="h3" className={classes.tokenMetricHeaderText}>
          {title}
        </Typography>
      </Grid>
      <Grid item={true} xs={12}>
        <SubCard>
          <CardContent className={classes.tokenChartCardContent}>
            <TokenChart
              data={data}
              yAxisLabel={yAxisLabel}
              isPercentage={isPercentage}
            />
          </CardContent>
        </SubCard>
      </Grid>
      <Grid item={true} xs={12} md={6}>
        <SubCard>
          <CardContent className={classes.tokenCardContent}>
            <div className={classes.tokenMetricValue}>{metricText}</div>
            <div className={classes.tokenMetricSubtitle}>{metricSubtitle}</div>
          </CardContent>
        </SubCard>
      </Grid>
      <Grid item={true} xs={12} md={6}>
        <SubCard>
          <CardContent className={classes.tokenCardContent}>
            <div className={classes.tokenMetricValue}>
              <a href={dashboardLink}>{rankText}</a>
            </div>
            <div className={classes.tokenMetricSubtitle}>{rankSubtitle}</div>
          </CardContent>
        </SubCard>
      </Grid>
    </>
  )
}

function TokenMetrics({ classes, tokenMetrics, coinObj }: Props) {
  return (
    <Grid container={true} spacing={16}>
      {Object.keys(TOKEN_METRIC_OBJ_DATA).map(
        (key) =>
          _.get(tokenMetrics, [`${key}_metadata`, 'rank'], 0) > 0 && (
            <TokenMetric
              key={key}
              classes={classes}
              coinObj={coinObj}
              data={_.get(tokenMetrics, `${key}_data`)}
              metaData={_.get(tokenMetrics, `${key}_metadata`)}
              tokenObj={TOKEN_METRIC_OBJ_DATA[key]}
            />
          ),
      )}
    </Grid>
  )
}

export default withStyles(styles)(TokenMetrics)
