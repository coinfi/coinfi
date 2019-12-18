import * as React from 'react'
import * as _ from 'lodash'
import * as moment from 'moment'
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
      overflowX: 'auto',
      [theme.breakpoints.down('sm')]: {
        overflowX: 'scroll',
      },
    },
    exchangeLogo: {
      width: '20px',
      height: '20px',
      verticalAlign: 'bottom',
      marginRight: '8px',
    },
    subtext: {
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
    orderCell: {
      [theme.breakpoints.up('md')]: {
        paddingLeft: '16px !important',
      },
    },
    exchangeCell: {
      whiteSpace: 'nowrap',
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

    let data = [...props.data]
    const accountedForVolumePercentage = data.reduce(
      (sum, pair) => sum + _.get(pair, 'volume_percentage', 0) * 100,
      0,
    )
    // handle edge case where no volume percentage data was available
    // consider available volume to be full volume
    if (accountedForVolumePercentage === 0 && data.length > 0) {
      const totalVolume = data.reduce(
        (sum, pair) => sum + _.get(pair, 'volume24h', 0),
        0,
      )
      data = data.map((pair) => {
        const volume24h = _.get(pair, 'volume24h', 0)
        return {
          ...pair,
          volume_percentage: volume24h / totalVolume,
        }
      })
    }

    this.state = {
      order: 'asc',
      orderBy: null,
      sortedData: data,
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
                  <TableCell
                    className={classnames(
                      classes.tableHeadCell,
                      classes.orderCell,
                    )}
                  >
                    #
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>
                    Exchange
                  </TableCell>
                  <TableCell className={classes.tableHeadCell} align="right">
                    Market
                  </TableCell>
                  <TableCell className={classes.tableHeadCell} align="right">
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
                  <TableCell className={classes.tableHeadCell} align="right">
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
                  <TableCell className={classes.tableHeadCell} align="right">
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
                    exchange_id: exchangeId,
                    exchange_name: exchangeName,
                    pair,
                    price: usdPrice,
                    volume24h: usdVolume24h,
                    quote_currency_symbol: quoteSymbol,
                    volume24h_quote: quoteVolume24h,
                    volume_percentage: volumePercentage,
                    last_updated: lastUpdated,
                  } = row

                  const volume24h = usdVolume24h * currencyRate
                  const price = usdPrice * currencyRate
                  const imageUrl = `/static/exchanges/${exchangeId}.png`

                  return (
                    <TableRow key={index}>
                      <TableCell
                        className={classnames(
                          classes.tableCell,
                          classes.orderCell,
                        )}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        className={classnames(
                          classes.tableCell,
                          classes.exchangeCell,
                        )}
                      >
                        {_.isNumber(exchangeId) && (
                          <img
                            src={imageUrl}
                            className={classes.exchangeLogo}
                          />
                        )}
                        {exchangeName}
                      </TableCell>
                      <TableCell className={classes.tableCell} align="right">
                        {pair}
                        {!!lastUpdated && (
                          <div className={classes.subtext}>
                            {moment(lastUpdated).fromNow()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className={classes.tableCell} align="right">
                        {currencySymbol}
                        {formatVolume(volume24h)}
                        <div className={classes.subtext}>
                          {formatVolume(quoteVolume24h)} {quoteSymbol}
                        </div>
                      </TableCell>
                      <TableCell className={classes.tableCell} align="right">
                        {currencySymbol}
                        {formatPrice(price)}
                      </TableCell>
                      <TableCell className={classes.tableCell} align="right">
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
