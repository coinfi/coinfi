import * as React from 'react'
import { Component, Fragment } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import compose from 'recompose/compose'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableFooter,
} from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'
import withDevice, {
  DeviceContextType,
} from '~/bundles/common/utils/withDevice'
import ColumnNames from './ColumnNames'
import SearchCoins from '~/bundles/common/components/SearchCoins'
import LoadingIndicator from '~/bundles/common/components/LoadingIndicator'
import API from '../common/utils/localAPI'
import * as _ from 'lodash'
import TablePaginationActions from './TablePaginationActions'
import {
  CurrencyContextType,
  withCurrency,
} from '~/bundles/common/contexts/CurrencyContext'
import { black65 } from '~/bundles/common/styles/colors'
import LazyLoadImage from '~/bundles/common/components/LazyLoadImage'

interface CoinData {
  id: number
  name: string
  symbol: string
  slug: string
  coin_key: string
  ranking: number
  image_url: string
  price: any
  market_cap: any
  change1h: string
  change24h: string
  change7d: string
  volume24: any
  sparkline: string
}

interface PaginatedCoins {
  [page: number]: CoinData[]
}

interface Props
  extends RouteComponentProps<any>,
    CurrencyContextType,
    DeviceContextType {
  classes: any
  width: any
  coinCount: number
  intialCoins: CoinData[]
  page: number
  limit: number
}

interface State {
  currentPage: number
  pageSize: number
  coinsByPage: PaginatedCoins
  loading: boolean
}

const DEFAULTS = {
  page: 1,
  limit: 100,
}

const styles = (theme) =>
  createStyles({
    headerWrapper: {
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      padding: '1rem 0 0 1rem',
    },
    headerTitle: {
      margin: 0,
      lineHeight: 1,
    },
    headerSearch: {
      display: 'flex',
    },
    tableWrapper: {
      width: '100%',
    },
    table: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    tableHeader: {
      color: black65,
    },
    tableRow: {
      minHeight: `${theme.spacing.unit * 7}px`,
    },
    tablePaginationToolbar: {
      [theme.breakpoints.down('sm')]: {
        flexWrap: 'wrap',
        height: 'auto',
        justifyContent: 'space-evenly',
        padding: '1rem',
        paddingBottom: 0,
      },
    },
    sparkline: {
      width: '200px',
    },
    mobileTableCell: {
      paddingTop: `${theme.spacing.unit * 2}px`,
      paddingBottom: `${theme.spacing.unit * 2}px`,
    },
    mobileTableCellInner: {
      minHeight: `${theme.spacing.unit * 2}px`,
    },
    mobileTitle: {
      width: '30%',
      display: 'inline-block',
    },
    ranking: {
      width: '30px',
      maxWidth: '40px',
    },
    name: {
      width: '240px',
      maxWidth: '240px',
    },
    coinWrapper: {},
    coinIcon: {
      flexShrink: 0,
      paddingRight: '7px',
    },
    coinSymbol: {},
    coinName: {},
  })

class CoinIndex extends Component<Props, State> {
  constructor(props) {
    super(props)

    const loading = _.isUndefined(props.initialCoins)
    const currentPage = props.page || DEFAULTS.page
    const initialCoins = props.initialCoins || []
    const pageSize = props.limit || DEFAULTS.limit

    this.state = {
      coinsByPage: !loading ? { [currentPage]: initialCoins } : {},
      currentPage,
      pageSize,
      loading,
    }
  }

  public handlePageChange = (event, nextPage) => {
    this.setState({
      currentPage: nextPage + 1,
    })
  }

  public handlePageSizeChange = (event) => {
    const newPageSize = _.get(event, ['target', 'value'], DEFAULTS.limit)

    this.setState({
      pageSize: newPageSize,
      coinsByPage: {},
    })
  }

  public fetchCoins = (params: { per?: number; page?: number } = {}): void => {
    this.setState({ loading: true })
    API.get('/coins', params).then((response) => {
      const { page } = params
      this.setState((prevState) => ({
        loading: false,
        coinsByPage: {
          ...prevState.coinsByPage,
          [page || DEFAULTS.page]: response.payload,
        },
      }))
    })
  }

  public fetchCoinsWithCaching = (
    params: { per?: number; page?: number } = {},
  ): void => {
    const { page } = params
    const { coinsByPage } = this.state
    const currentCoins = coinsByPage[page]
    const isCached = _.isArray(currentCoins) && currentCoins.length > 0

    if (!isCached) {
      this.fetchCoins(params)
    }
  }

  public componentDidMount() {
    this.fetchCoinsWithCaching({
      per: this.state.pageSize,
      page: this.state.currentPage,
    })
  }

  public componentDidUpdate(prevProps, prevState) {
    const currentPageDidChange =
      prevState.currentPage !== this.state.currentPage
    const pageSizeDidChange = prevState.pageSize !== this.state.pageSize

    if (currentPageDidChange || pageSizeDidChange) {
      const { pageSize, currentPage } = this.state

      // Update URL for SEO purposes
      // update page if not 1
      // update per queries if not default page size
      const searchParams = new URLSearchParams({
        ...(currentPage > 1 && { page: currentPage.toString() }),
        ...(pageSize !== DEFAULTS.limit && { per: pageSize.toString() }),
      }).toString()
      this.props.history.push({
        search: `?${searchParams}`,
      })

      this.fetchCoinsWithCaching({
        per: pageSize,
        page: currentPage,
      })
    }
  }

  public render() {
    const {
      coinCount,
      classes,
      currency,
      currencyRate,
      currencySymbol,
      isDesktop,
    } = this.props
    const { loading, pageSize, currentPage, coinsByPage } = this.state
    const rows = coinsByPage[currentPage] || []
    const columns = ColumnNames({ currency, currencyRate, currencySymbol })
    const isMobile = !isDesktop

    return (
      <Fragment>
        <div className={classes.headerWrapper}>
          <h1 className={classes.headerTitle}>Coins</h1>
          <div className={classes.headerSearch}>
            <SearchCoins
              onSelect={(suggestion) =>
                (window.location.href = `/coins/${suggestion.slug}`)
              }
              unstyled={true}
            />
          </div>
        </div>

        <div className={classes.tableWrapper}>
          <Table padding="dense" className={classes.table}>
            {!isMobile && (
              <TableHead className={classes.tableHeader}>
                <TableRow>
                  {columns.map((col, colIndex) => {
                    const { title, align, dataIndex } = col

                    return (
                      <TableCell
                        key={colIndex}
                        style={{ textAlign: align }}
                        className={classes[dataIndex]}
                      >
                        {title}
                      </TableCell>
                    )
                  })}
                </TableRow>
              </TableHead>
            )}
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <LoadingIndicator />
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, rowIndex) => {
                  return (
                    <TableRow key={row.id} className={classes.tableRow}>
                      {isMobile ? (
                        <TableCell
                          key={rowIndex}
                          className={classes.mobileTableCell}
                        >
                          {row.image_url && (
                            <LazyLoadImage
                              alt={row.name}
                              src={row.image_url}
                              className="fr ml2"
                            />
                          )}
                          {columns.map((col, colIndex) => {
                            const {
                              dataIndex,
                              render,
                              mobileRender,
                              title,
                            } = col
                            const text = row[dataIndex]

                            if (dataIndex === 'sparkline') {
                              return
                            }

                            return (
                              <div
                                key={colIndex}
                                className={classes.mobileTableCellInner}
                              >
                                <b className={classes.mobileTitle}>{title}</b>
                                {mobileRender
                                  ? mobileRender(text, row, colIndex)
                                  : render
                                    ? render(text, row, colIndex)
                                    : text}
                              </div>
                            )
                          })}
                        </TableCell>
                      ) : (
                        columns.map((col, colIndex) => {
                          const { dataIndex, render, align } = col
                          const text = _.get(row, dataIndex)
                          return (
                            <TableCell
                              key={colIndex}
                              align={align}
                              className={classes[dataIndex]}
                            >
                              {render
                                ? render(text, row, colIndex, classes)
                                : text}
                            </TableCell>
                          )
                        })
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  classes={{ toolbar: classes.tablePaginationToolbar }}
                  count={coinCount}
                  rowsPerPage={pageSize}
                  page={currentPage - 1}
                  rowsPerPageOptions={[10, 25, 100]}
                  onChangePage={this.handlePageChange}
                  onChangeRowsPerPage={this.handlePageSizeChange}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Fragment>
    )
  }
}

export default compose(
  withDevice,
  withStyles(styles),
)(withRouter(withCurrency(CoinIndex)))
