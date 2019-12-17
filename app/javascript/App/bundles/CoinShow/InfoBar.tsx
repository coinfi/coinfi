import * as React from 'react'
import * as _ from 'lodash'
import classnames from 'classnames'
import Icon from '~/bundles/common/components/Icon'
import { Grid, Typography } from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'
import {
  black54,
  black87,
  aquaGreen,
  grapefruit,
} from '~/bundles/common/styles/colors'
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
  isMobile: boolean
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
      color: black87,
      fontSize: '12px',
      fontWeight: 500,
      [theme.breakpoints.up('md')]: {
        padding: '24px',
        paddingBottom: '0',
        alignItems: 'baseline',
        flexWrap: 'nowrap',
      },
      [theme.breakpoints.down('sm')]: {
        padding: '16px 16px 0',
      },
    },
    titleRoot: {
      [theme.breakpoints.up('md')]: {
        paddingRight: '16px',
      },
      [theme.breakpoints.down('sm')]: {
        marginBottom: '34px',
      },
    },
    coinImage: {
      marginRight: '12px',
      maxHeight: '34px',
      verticalAlign: 'sub',
    },
    coinName: {
      fontSize: '34px',
      fontWeight: 500,
      marginRight: '7px',
      display: 'inline',
    },
    coinSymbol: {
      color: black54,
      height: '34px',
      verticalAlign: '2px',
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
    watchButtonContainer: {
      marginBottom: '16px',
      textAlign: 'right',
    },
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
    detailsTable: {
      [theme.breakpoints.up('md')]: {
        float: 'right',
        display: 'flex',
        flexWrap: 'wrap',
        '& tr': {
          flexBasis: '50%',
          maxWidth: '50%',
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
    detailsRoot: {
      alignSelf: 'center',
    },
    detailsTitle: {
      color: black54,
      fontSize: '12px',
      lineHeight: '17px',
      paddingBottom: '4px',
      whiteSpace: 'nowrap',
    },
    detailsValue: {
      fontSize: '14px',
      lineHeight: '17px',
      whiteSpace: 'nowrap',
      paddingBottom: '8px',
      [theme.breakpoints.down('sm')]: {
        marginBottom: '10px',
        textAlign: 'right',
      },
    },
  })

class InfoBar extends React.Component<Props, {}> {
  public render() {
    const {
      coinObj,
      classes,
      isMobile,
      isWatched,
      watchCoinHandler,
    } = this.props
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

    const positiveColour = aquaGreen
    const negativeColour = grapefruit
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
              {isMobile && (
                <Grid
                  item={true}
                  xs={12}
                  className={classes.watchButtonContainer}
                >
                  <Icon
                    name="star"
                    solid={true}
                    dataHeapTag={
                      isWatched ? '' : 'news-add-coin-to-watchlist-button'
                    }
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
              )}
              <Grid
                item={true}
                xs={12}
                md="auto"
                container={true}
                justify="flex-start"
                alignItems="baseline"
                alignContent="flex-start"
                className={classes.titleRoot}
              >
                <Grid item={true}>
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
                <Grid
                  item={true}
                  xs={12}
                  container={true}
                  direction="row"
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
                <Grid item={true} className={classes.coinRanking}>
                  <sub>Rank #{ranking}</sub>
                </Grid>
              </Grid>
              <Grid
                item={true}
                xs={12}
                md="auto"
                className={classes.detailsRoot}
              >
                <table className={classes.detailsTable}>
                  <tr>
                    <td className={classes.detailsTitle}>Market Cap</td>
                    <td className={classes.detailsValue}>
                      {hasMarketCap &&
                        `${currencySymbol}${formatPrice(
                          market_cap * currencyRate,
                        )} ${currency}`}
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.detailsTitle}>24h Volume</td>
                    <td className={classes.detailsValue}>
                      {hasVolume24 && (
                        <>
                          {currencySymbol}
                          {formatVolume(volume24h * currencyRate)} {currency}{' '}
                          <span style={changeStyle24h}>
                            {hasChange24h &&
                              `(${formatPercentage(change24h)}%)`}
                          </span>
                        </>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.detailsTitle}>Circulating Supply</td>
                    <td className={classes.detailsValue}>
                      {!_.isUndefined(available_supply) &&
                        `${formatSupply(available_supply)} ${symbol}`}
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.detailsTitle}>Total Supply</td>
                    <td className={classes.detailsValue}>
                      {!_.isUndefined(total_supply) &&
                        `${formatSupply(total_supply)} ${symbol}`}
                    </td>
                  </tr>
                </table>
              </Grid>
            </Grid>
          )
        }}
      </CurrencyContext.Consumer>
    )
  }
}

export default withStyles(styles)(InfoBar)
