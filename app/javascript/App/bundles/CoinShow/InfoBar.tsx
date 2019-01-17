import * as React from 'react'
import * as _ from 'lodash'
import classnames from 'classnames'
import Icon from '~/bundles/common/components/Icon'
import { Grid, Typography } from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'
import {
  formatPercentage,
  formatSupply,
  formatPrice,
  formatVolume,
} from '~/bundles/common/utils/numberFormatters'
import CurrencyContext, {
  CurrencyContextType,
} from '~/bundles/common/contexts/CurrencyContext'
interface Props {
  isWatched: boolean
  watchCoinHandler: () => void
  coinObj: any
  currency: string
  classes: any
}

const styles = (theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: '12px',
      fontWeight: 500,
      [theme.breakpoints.up('md')]: {
        padding: '24px',
        paddingBottom: '0',
        alignItems: 'baseline',
      },
      [theme.breakpoints.down('sm')]: {
        padding: '40px 16px 0',
      },
      '& > *:not(:last-child)': {
        [theme.breakpoints.down('sm')]: {
          marginBottom: '34px',
        },
      },
    },
    coinDetails: {},
    coinImage: {
      marginRight: '12px',
      maxHeight: '34px',
      verticalAlign: 'sub',
    },
    coinName: {
      fontSize: '34px',
      fontWeight: 500,
      marginRight: '7px',
      display: 'inline-block',
    },
    coinSymbol: {
      color: 'rgba(0, 0, 0, 0.54)',
    },
    coinRanking: {
      marginRight: '16px',
    },
    coinPriceRoot: {
      fontSize: '24px',
      whiteSpace: 'nowrap',
    },
    coinPrice: {
      marginRight: `${theme.spacing.unit * 1.5}px`,
    },
    watchButtonContainer: {},
    watchButton: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: '4px',
      padding: '4px',
      fontSize: '12px',
      fontWeight: 600,
      lineHeight: '16px',
      fontFamily: 'Avenir, sans-serif',
      '& i': {
        verticalAlign: 'middle',
        fontSize: '8px',
      },
    },
    watchedButton: {
      backgroundColor: '#40a9ff',
      color: '#fff',
    },
    unwatchedButton: {
      backgroundColor: '#fff',
      color: '#40a9ff',
    },
    detailsRoot: {
      alignSelf: 'flex-start',
      '& > *': {
        paddingBottom: '8px',
      },
    },
    detailsTitle: {
      color: 'rgba(0, 0, 0, 0.54)',
      fontSize: '12px',
    },
    detailsValue: {
      fontSize: '14px',
      lineHeight: 1.25,
      whiteSpace: 'pre-wrap',
      [theme.breakpoints.down('sm')]: {
        marginBottom: '10px',
      },
    },
  })

class InfoBar extends React.Component<Props, {}> {
  public render() {
    const { coinObj, classes, isWatched, watchCoinHandler } = this.props
    const {
      market_cap,
      change1h,
      change24h,
      volume24h,
      available_supply,
      total_supply,
      symbol,
      ranking,
      price,
    } = coinObj
    const hasMarketCap = !_.isUndefined(market_cap)
    const hasChange24h = !_.isUndefined(change24h)
    const hasVolume24 = !_.isUndefined(volume24h)

    const positiveColour = '#12d8b8'
    const negativeColour = '#ff6161'
    const percentChange1h = change1h || 0
    const changeStyle1h =
      percentChange1h >= 0
        ? { color: positiveColour }
        : { color: negativeColour }
    const percentChange24h = change24h || 0
    const changeStyle24h =
      percentChange24h >= 0
        ? { color: positiveColour }
        : { color: negativeColour }

    return (
      <CurrencyContext.Consumer>
        {({ currency, currencyRate, currencySymbol }: CurrencyContextType) => {
          return (
            <Grid
              container={true}
              justify="flex-start"
              alignItems="flex-start"
              className={classes.root}
            >
              <Grid
                item={true}
                xs={12}
                md={3}
                container={true}
                justify="flex-start"
                alignItems="baseline"
                alignContent="flex-start"
              >
                <Grid item={true} className={classes.coinDetails}>
                  <img
                    alt={coinObj.name}
                    src={coinObj.image_url}
                    className={classes.coinImage}
                  />
                  <Typography variant="h1" className={classes.coinName}>
                    {coinObj.name}
                  </Typography>
                  {!_.isUndefined(symbol) && (
                    <span className={classes.coinSymbol}>({symbol})</span>
                  )}
                </Grid>
                <Grid item={true} xs={12} style={{ height: '10px' }} />
                <Grid item={true} className={classes.coinRanking}>
                  Rank #{ranking}
                </Grid>
                <Grid item={true} className={classes.watchButtonContainer}>
                  <Icon
                    name="star"
                    solid={true}
                    className={classnames(
                      classes.watchButton,
                      isWatched
                        ? classes.watchedButton
                        : classes.unwatchedButton,
                    )}
                    onClick={watchCoinHandler}
                  >
                    {isWatched ? 'Unwatch Coin' : 'Watch Coin'}
                  </Icon>
                </Grid>
              </Grid>
              <Grid
                item={true}
                xs={12}
                md={4}
                container={true}
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
              >
                <Grid item={true} className={classes.coinPriceRoot}>
                  <span className={classes.price}>
                    {currencySymbol}
                    {formatPrice(price * currencyRate)}
                  </span>{' '}
                  <span style={changeStyle1h}>
                    ({formatPercentage(percentChange1h)}%)
                  </span>
                </Grid>
              </Grid>
              <Grid
                item={true}
                xs={12}
                md={5}
                container={true}
                justify="flex-start"
                alignItems="stretch"
                alignContent="stretch"
                wrap="wrap"
                className={classes.detailsRoot}
              >
                <Grid item={true} xs={6} className={classes.detailsTitle}>
                  Market Cap
                </Grid>
                <Grid item={true} xs={6} className={classes.detailsTitle}>
                  24h Volume
                </Grid>
                <Grid item={true} xs={6} className={classes.detailsValue}>
                  {hasMarketCap &&
                    `${currencySymbol}${formatPrice(
                      market_cap * currencyRate,
                    )} ${currency}`}
                </Grid>
                <Grid item={true} xs={6} className={classes.detailsValue}>
                  <span>
                    {hasVolume24 &&
                      `${currencySymbol}${formatVolume(
                        volume24h * currencyRate,
                      )} ${currency}`}
                  </span>{' '}
                  <span style={changeStyle24h}>
                    {hasChange24h && `(${formatPercentage(change24h)}%)`}
                  </span>
                </Grid>
                <Grid item={true} xs={6} className={classes.detailsTitle}>
                  Circulating Supply
                </Grid>
                <Grid item={true} xs={6} className={classes.detailsTitle}>
                  Total Supply
                </Grid>
                <Grid item={true} xs={6} className={classes.detailsValue}>
                  {!_.isUndefined(available_supply) &&
                    `${formatSupply(available_supply)} ${symbol}`}
                </Grid>
                <Grid item={true} xs={6} className={classes.detailsValue}>
                  {!_.isUndefined(total_supply) &&
                    `${formatSupply(total_supply)} ${symbol}`}
                </Grid>
              </Grid>
            </Grid>
          )
        }}
      </CurrencyContext.Consumer>
    )
  }
}

export default withStyles(styles)(InfoBar)
