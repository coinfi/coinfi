import * as React from 'react'
import * as _ from 'lodash'
import classnames from 'classnames'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
} from '@material-ui/core'
import CurrencyContext, {
  CurrencyContextType,
} from '~/bundles/common/contexts/CurrencyContext'
import { createStyles, withStyles } from '@material-ui/core/styles'
import Icon from '~/bundles/common/components/Icon'
import {
  formatValue,
  formatPrice,
  formatVolume,
  formatPercentage,
} from '~/bundles/common/utils/numberFormatters'

interface Props {
  classes: any
  data: MarketData[]
  total: number
}

interface State {
  orderBy: string
  order: ORDERS
  sortedData: MarketData[]
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

const generateSortIcon = ({ property, orderBy, order }) => {
  if (orderBy === property) {
    if (order === 'asc') {
      return () => <Icon name="sort-up" solid={true} />
    } else {
      return () => <Icon name="sort-down" solid={true} />
    }
  } else {
    return () => <Icon name="sort" solid={true} />
  }
}

class MarketsTable extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      order: 'asc',
      orderBy: null,
      sortedData: props.data,
    }
  }

  public handleSortChange = (property) => (event) => {
    const order: ORDERS =
      this.state.orderBy === property && this.state.order === 'asc'
        ? 'desc'
        : 'asc'
    const orderBy = property

    const sortedData = this.sortData(this.state.sortedData, order, orderBy)

    this.setState({
      order,
      orderBy,
      sortedData,
    })
  }

  public sortData = (data: MarketData[], order, orderBy): MarketData[] => {
    const ascendingData = _.sortBy(data, (d) => d[orderBy]) as MarketData[]
    return order === 'desc' ? _.reverse(ascendingData) : ascendingData
  }

  public render() {
    const { total, classes } = this.props
    const { order, orderBy, sortedData: data } = this.state

    if (_.isEmpty(data)) {
      return null
    }

    const totalNotShown = _.isNumber(total) ? total - data.length : 0
    const remainingVolume = data.reduce(
      (difference, pair) =>
        difference - _.get(pair, 'volume_percentage', 0) * 100,
      100,
    )

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
                    <TableSortLabel
                      active={orderBy === 'volume24h'}
                      direction={order}
                      onClick={this.handleSortChange('volume24h')}
                      IconComponent={generateSortIcon({
                        orderBy,
                        order,
                        property: 'volume24h',
                      })}
                    >
                      Volume (24hr)
                    </TableSortLabel>
                  </TableCell>
                  <TableCell className={classes.tableHeadCell} numeric={true}>
                    <TableSortLabel
                      active={orderBy === 'price'}
                      direction={order}
                      onClick={this.handleSortChange('price')}
                      IconComponent={generateSortIcon({
                        orderBy,
                        order,
                        property: 'price',
                      })}
                    >
                      Price
                    </TableSortLabel>
                  </TableCell>
                  <TableCell className={classes.tableHeadCell} numeric={true}>
                    <TableSortLabel
                      active={orderBy === 'volume_percentage'}
                      direction={order}
                      onClick={this.handleSortChange('volume_percentage')}
                      IconComponent={generateSortIcon({
                        orderBy,
                        order,
                        property: 'volume_percentage',
                      })}
                    >
                      Volume %
                    </TableSortLabel>
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
                      {formatValue(totalNotShown)} additional market pairs not
                      shown
                      {remainingVolume > 0 &&
                        ` (${formatPercentage(remainingVolume)}% of volume)`}
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
}

export default withStyles(styles, { withTheme: true })(MarketsTable)
