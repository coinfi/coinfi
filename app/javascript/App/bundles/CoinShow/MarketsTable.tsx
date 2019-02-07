import * as React from 'react'
import * as _ from 'lodash'
import classnames from 'classnames'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core'
import CurrencyContext, {
  CurrencyContextType,
} from '~/bundles/common/contexts/CurrencyContext'
import { createStyles, withStyles } from '@material-ui/core/styles'
import {
  formatPrice,
  formatVolume,
  formatPercentage,
} from '~/bundles/common/utils/numberFormatters'

interface Props {
  classes: any
  data: MarketData[]
  total: number
}

const styles = (theme) =>
  createStyles({
    wrapper: {
      overflowX: 'scroll',
    },
    quote: {
      whiteSpace: 'nowrap',
      fontSize: '12px',
      color: 'rgba(0, 0, 0, 0.54)',
      paddingTop: '4px',
    },
    tableHeadRow: {
      height: '28px',
    },
    tableHeadCell: {
      paddingTop: '8px !important',
    },
    tableCell: {
      fontSize: '14px',
    },
    remainderTableCell: {
      textAlign: 'center',
    },
  })

function MarketsTable(props: Props) {
  const { data, total, classes } = props

  if (_.isEmpty(data)) {
    return null
  }

  const totalNotShown = _.isNumber(total) ? total - data.length : 0

  return (
    <CurrencyContext.Consumer>
      {({ currency, currencyRate, currencySymbol }: CurrencyContextType) => (
        <div className={classes.wrapper}>
          <Table padding="dense">
            <TableHead>
              <TableRow className={classes.tableHeadRow}>
                <TableCell className={classes.tableHeadCell}>#</TableCell>
                <TableCell className={classes.tableHeadCell}>
                  Exchange
                </TableCell>
                <TableCell className={classes.tableHeadCell} numeric={true}>
                  Market
                </TableCell>
                <TableCell className={classes.tableHeadCell} numeric={true}>
                  Volume (24hr)
                </TableCell>
                <TableCell className={classes.tableHeadCell} numeric={true}>
                  Price
                </TableCell>
                <TableCell className={classes.tableHeadCell} numeric={true}>
                  Volume %
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row: MarketData, index: number) => {
                const {
                  exchange_name: exchangeName,
                  pair,
                  price: usdPrice,
                  volume24h: usdVolume24h,
                  quote_currency_symbol: quoteSymbol,
                  volume24h_quote: quoteVolume24h,
                  volume_percentage: volumePercentage,
                } = row

                const volume24h = usdVolume24h * currencyRate
                const price = usdPrice * currencyRate

                return (
                  <TableRow key={index}>
                    <TableCell className={classes.tableCell}>
                      {index + 1}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {exchangeName}
                    </TableCell>
                    <TableCell className={classes.tableCell} numeric={true}>
                      {pair}
                    </TableCell>
                    <TableCell className={classes.tableCell} numeric={true}>
                      {currencySymbol}
                      {formatVolume(volume24h)}
                      <div className={classes.quote}>
                        {formatVolume(quoteVolume24h)} {quoteSymbol}
                      </div>
                    </TableCell>
                    <TableCell className={classes.tableCell} numeric={true}>
                      {currencySymbol}
                      {formatPrice(price)}
                    </TableCell>
                    <TableCell className={classes.tableCell} numeric={true}>
                      {formatPercentage(volumePercentage * 100)}%
                    </TableCell>
                  </TableRow>
                )
              })}
              {totalNotShown > 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className={classnames(
                      classes.tableCell,
                      classes.remainderTableCell,
                    )}
                  >
                    {totalNotShown} additional market pairs not shown
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </CurrencyContext.Consumer>
  )
}

export default withStyles(styles, { withTheme: true })(MarketsTable)
