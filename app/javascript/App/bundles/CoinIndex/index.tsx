import * as React from 'react'
import { Component, Fragment } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableFooter,
  Typography,
} from '@material-ui/core'
import ColumnNames from './ColumnNames'
import SearchCoins from '~/bundles/common/components/SearchCoins'
import LoadingIndicator from '~/bundles/common/components/LoadingIndicator'
import API from '../common/utils/localAPI'
import * as _ from 'lodash'

interface CoinData {
  id: number
  name: string
  symbol: string
  slug: string
  coin_key: string
  ranking: number
  image_url: string
  price: string
  market_cap: string
  change1h: string
  change24h: string
  change7d: string
  volume24: string
  sparkline: string
}

interface PaginatedCoins {
  [page: number]: CoinData[]
}

interface Props extends RouteComponentProps<any> {
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
  currency: string
}

const DEFAULTS = {
  page: 1,
  limit: 100,
  currency: 'USD',
}

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
      currency: DEFAULTS.currency,
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

  public changeCurrencyHandler = ({ key }) => {
    this.setState({
      currency: key,
    })
  }

  public render() {
    const { coinCount } = this.props
    const { loading, pageSize, currentPage, coinsByPage } = this.state
    const rows = coinsByPage[currentPage] || []
    const columns = ColumnNames(this.state.currency)

    return (
      <Fragment>
        <div className="flex">
          <h1 className="pt3 pl3">Coins</h1>
          <span style={{ flexGrow: 1 }} />
          <div className="flex pt3">
            <div className="ma2">
              <SearchCoins
                onSelect={(suggestion) =>
                  (window.location.href = `/coins/${suggestion.slug}`)
                }
                unstyled={true}
              />
            </div>
          </div>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, colIndex) => {
                const { title, align } = col
                const isNumeric = align === 'right'

                return (
                  <TableCell key={colIndex} numeric={isNumeric}>
                    {title}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
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
                  <TableRow key={row.id}>
                    {columns.map((col, colIndex) => {
                      const { dataIndex, render, align } = col
                      const text = row[dataIndex]
                      const isNumeric = align === 'right'
                      return (
                        <TableCell key={colIndex} numeric={isNumeric}>
                          {render ? render(text, row, colIndex) : text}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={coinCount}
                rowsPerPage={pageSize}
                page={currentPage - 1}
                rowsPerPageOptions={[10, 25, 100]}
                onChangePage={this.handlePageChange}
                onChangeRowsPerPage={this.handlePageSizeChange}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Fragment>
    )
  }
}

export default withRouter(CoinIndex)
