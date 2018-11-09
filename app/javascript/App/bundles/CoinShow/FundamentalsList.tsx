import * as React from 'react'
import * as _ from 'lodash'
import Icon from '~/bundles/common/components/Icon'
import { Grid, withStyles, createStyles } from '@material-ui/core'
import {
  formatValueWithCurrency,
  formatValue,
} from '~/bundles/common/utils/numberFormatters'

interface Props {
  coinObj: any
  currency: string
  classes: any
}

const styles = (theme) =>
  createStyles({
    title: {
      color: 'rgba(0,0,0,0.38)',
      marginBottom: '4px',
      fontSize: '14px',
      lineHeight: '22px',
    },
    value: {
      fontWeight: 'bold',
      color: '#555',
      marginBottom: '4px',
      fontSize: '14px',
      lineHeight: '22px',
      whiteSpace: 'nowrap',
    },
  })

class FundamentalsList extends React.Component<Props, {}> {
  public render() {
    const { coinObj, classes } = this.props
    const currency = this.props.currency.toUpperCase()
    const currencyKey = currency.toLowerCase()
    const {
      market_cap,
      change24h,
      change7d,
      available_supply,
      total_supply,
      max_supply,
      symbol,
    } = coinObj
    const hasMarketCap = _.has(market_cap, currencyKey)
    const hasChange24h = !_.isUndefined(change24h)
    const hasChange7d = !_.isUndefined(change7d)

    return (
      <Grid container={true} direction="column">
        {hasMarketCap && (
          <React.Fragment>
            <Grid item={true} className={classes.title}>
              Market Cap
            </Grid>
            <Grid item={true} className={classes.value}>
              {formatValueWithCurrency(market_cap[currencyKey], currency)}{' '}
              {currency}
            </Grid>
            {(hasChange24h || hasChange7d) && (
              <Grid
                item={true}
                container={true}
                alignContent="space-between"
                alignItems="flex-start"
                className={classes.title}
              >
                {hasChange24h && (
                  <Grid item={true} xs={12} md={6}>
                    24HR {formatValue(change24h, 2)}%
                  </Grid>
                )}
                {hasChange7d && (
                  <Grid item={true} xs={12} md={6}>
                    7D {formatValue(change7d, 2)}%
                  </Grid>
                )}
              </Grid>
            )}
          </React.Fragment>
        )}
        {!_.isUndefined(available_supply) && (
          <React.Fragment>
            <Grid item={true} className={classes.title}>
              Available Supply
            </Grid>
            <Grid item={true} className={classes.value}>
              {formatValue(available_supply, 0)} {symbol}
            </Grid>
          </React.Fragment>
        )}
        {!_.isUndefined(total_supply) && (
          <React.Fragment>
            <Grid item={true} className={classes.title}>
              Total Supply
            </Grid>
            <Grid item={true} className={classes.value}>
              {formatValue(total_supply, 0)} {symbol}
            </Grid>
          </React.Fragment>
        )}
        {!_.isUndefined(max_supply) && (
          <React.Fragment>
            <Grid item={true} className={classes.title}>
              Maximum Supply
            </Grid>
            <Grid item={true} className={classes.value}>
              {formatValue(max_supply, 0)} {symbol}
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    )
  }
}

export default withStyles(styles)(FundamentalsList)
