import * as React from 'react'
import * as _ from 'lodash'
import { AgGridReact } from 'ag-grid-react'
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Grid,
  createStyles,
  withStyles,
  Typography,
  Paper,
} from '@material-ui/core'
import classnames from 'classnames'
import ColumnNames from './ColumnNames'
import {
  formatAbbreviatedPrice,
  formatPrice,
  formatVolume,
} from '~/bundles/common/utils/numberFormatters'
import { CoinData, EnhancedCoinData } from './types'
import SearchCoins from '~/bundles/common/components/SearchCoins'
import WatchStar from '~/bundles/common/components/WatchStar'
import LazyLoadImage, {
  forceLazyLoadCheck,
} from '~/bundles/common/components/LazyLoadImage'
import API from '~/bundles/common/utils/API'
import coinsNormalizer from '~/bundles/common/normalizers/coins'
import {
  CurrencyContextType,
  withCurrency,
} from '~/bundles/common/contexts/CurrencyContext'
import { openSignUpModal } from '~/bundles/common/utils/modals'

interface Props extends CurrencyContextType {
  classes: any
  isLoggedIn: boolean
  isMobile: boolean
  currency: string
  coins: CoinData[]
  watchList: number[]
  pageCount?: number
}

interface State {
  columnDefs: any
  rowData: EnhancedCoinData[]
  context: any
  frameworkComponents: any
  watchList: number[]
}

const styles = (theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      backgroundColor: '#fff',
      [theme.breakpoints.up('md')]: {
        border: '1px solid #e5e8ed',
        borderRadius: '2px',
      },
    },
    headerContainer: {
      [theme.breakpoints.up('md')]: {
        paddingBottom: '8px',
      },
    },
    titleWrapper: {
      [theme.breakpoints.up('md')]: {
        alignSelf: 'flex-end',
        paddingBottom: '8px',
      },
    },
    title: {
      [theme.breakpoints.up('md')]: {
        fontSize: '24px',
        fontWeight: 500,
        display: 'inline-block',
        marginLeft: '24px',
        marginRight: '24px',
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        fontWeight: 400,
        borderBottom: '1px solid #e5e8ed',
        paddingTop: `16px !important`,
        paddingBottom: `16px !important`,
      },
    },
    search: {
      padding: `8px !important`,
      textAlign: 'center',
      [theme.breakpoints.up('md')]: {
        paddingTop: '16px !important',
        paddingRight: '16px !important',
        zIndex: 100,
        alignSelf: 'flex-end',
      },
    },
    searchWrapper: {
      padding: '0 10px',
      border: '1px solid #e5e8ed',
      borderRadius: '2px',
    },
    nav: {
      backgroundColor: '#fff',
      paddingTop: `8px !important`,
      paddingBottom: `8px !important`,
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        borderBottom: '1px solid #e5e8ed',
        paddingRight: `8px !important`,
      },
      [theme.breakpoints.up('md')]: {
        paddingRight: `16px !important`,
      },
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
    nextLink: {
      fontSize: '14px',
      fontWeight: 500,
      height: '30px',
      maxHeight: '30px',
      lineHeight: '30px',
      [theme.breakpoints.down('sm')]: {
        float: 'right',
        marginRight: '8px',
      },
    },
    desktopTableContainer: {
      display: 'flex',
      flex: 1,
      borderTop: '1px solid #e5e8ed',
    },
    mobileTableContainer: {},
    tableHeader: {
      height: '32px',
    },
    watchedColumnHeader: {
      paddingLeft: '4px !important',
    },
    watchedColumn: {
      paddingLeft: '4px !important',
      paddingBottom: '3px !important',
    },
    rankingColumnHeader: {
      paddingRight: '4px !important',
      color: '#333',
    },
    rankingColumn: {
      paddingRight: '4px !important',
      color: '#777',
    },
    coinColumnHeader: {
      color: '#333',
    },
    coinColumn: {
      color: '#777',
    },
    coinWrapper: {
      marginTop: '5px',
      marginBottom: '5px',
    },
    coinIcon: {
      width: '36px',
      maxWidth: '36px',
      flexShrink: 0,
      paddingRight: '4px',
    },
    coinSymbol: {},
    coinTitle: {
      fontSize: '0.8rem',
      fontWeight: 600,
    },
    coinDetailsLeft: {
      minWidth: '40px',
      maxWidth: '40px',
      fontSize: '0.6rem',
    },
    coinDetailsRight: {
      minWidth: '100px',
      fontSize: '0.6rem',
      textAlign: 'right',
      flexDirection: 'column',
    },
    priceColumnHeader: {
      minWidth: '100px',
      paddingRight: '8px !important',
      textAlign: 'right',
      color: '#333',
    },
    priceColumn: {
      paddingRight: '8px !important',
      textAlign: 'right',
      color: '#333',
    },
    footerContainer: {
      flexWrap: 'nowrap',
      justifyContent: 'flex-end',
      [theme.breakpoints.up('md')]: {
        margin: '0 auto',
        padding: '8px',
      },
      [theme.breakpoints.down('sm')]: {
        whiteSpace: 'nowrap',
        overflowX: 'scroll',
        padding: `${theme.spacing.unit}px`,
      },
    },
    paginationLink: {
      fontWeight: 500,
      width: '30px',
      maxWidth: '30px',
      height: '30px',
      maxHeight: '30px',
      lineHeight: '30px',
      textAlign: 'center',
    },
    paginationSpacer: {
      paddingLeft: '4px',
      paddingRight: '4px',
      height: '30px',
      maxHeight: '30px',
      lineHeight: '30px',
    },
  })

const PaginationButton = withStyles(styles)(
  ({
    classes,
    pageNumber,
    isCurrentPage,
  }: {
    classes: any
    pageNumber: number
    isCurrentPage?: boolean
  }) => {
    const buttonClasses = classnames(classes.paginationLink, {
      active: isCurrentPage,
    })

    return (
      <a href={`/coins?page=${pageNumber}`} className={buttonClasses}>
        {pageNumber}
      </a>
    )
  },
)

const Pagination = withStyles(styles)(
  ({
    classes,
    pagesToShow,
    pageCount,
  }: {
    classes: any
    pagesToShow: number
    pageCount: number
  }) => {
    const buttons = Array(Math.min(pagesToShow, pageCount))
      .fill(null)
      .map((none, index) => index + 1)

    return (
      <>
        {buttons.map((page) => (
          <PaginationButton key={page} pageNumber={page} />
        ))}
        {pagesToShow < pageCount && (
          <>
            <span className={classes.paginationSpacer}>...</span>
            <PaginationButton pageNumber={pageCount} />
          </>
        )}
      </>
    )
  },
)

class CoinTable extends React.Component<Props, State> {
  public api
  public columnApi

  constructor(props) {
    super(props)

    // combine stars with coins
    const enhancedCoins = this.combineCoinsWithWatchList(
      props.coins,
      props.watchList,
    )

    const { currency, currencyRate, currencySymbol } = props
    this.state = {
      watchList: props.watchList,
      columnDefs: ColumnNames({ currency, currencyRate, currencySymbol }),
      rowData: enhancedCoins,
      context: {
        componentParent: this,
        handleWatchStarClick: this.handleWatchStarClick,
      },
      frameworkComponents: {},
    }
  }

  public componentDidUpdate(prevProps) {
    if (prevProps.currency !== this.props.currency) {
      const { currency, currencyRate, currencySymbol } = this.props
      const columnDefs = ColumnNames({ currency, currencyRate, currencySymbol })
      this.setState({ columnDefs }, () => {
        this.api.setColumnDefs(columnDefs)
        this.api.sizeColumnsToFit()
      })
    }
  }

  public onGridReady = (params) => {
    this.api = params.api
    this.columnApi = params.columnApi

    this.api.sizeColumnsToFit()
    forceLazyLoadCheck()
  }

  // NOTE: Manually implementing watch button for now since ag-grid doesn't work well with context
  public handleWatchStarClick = (id, isWatched = false) => {
    if (!this.props.isLoggedIn) {
      openSignUpModal()
      return
    }

    if (isWatched) {
      this.removeCoinFromWatchlist(id)
    } else {
      this.addCoinToWatchlist(id)
    }
  }

  public fetchWatchlist = () =>
    API.get('/coins/watchlist', {}, false).then((response) =>
      Promise.resolve(coinsNormalizer(response.payload)),
    )

  public persistCoinToWatchlist = (id) =>
    API.post('/watchlist/coins', { id }, false)

  public addCoinToWatchlist = (coinId) =>
    this.persistCoinToWatchlist(coinId)
      .then(this.fetchWatchlist)
      .then(({ result: watchList }) => {
        const rowData = this.combineCoinsWithWatchList(
          this.props.coins,
          watchList,
        )

        this.setState({
          watchList,
          rowData,
        })
      })

  public deleteCoinFromWatchlist = (id) =>
    API.delete(`/watchlist/coins/${id}`, {}, false)

  public removeCoinFromWatchlist = (coinId) =>
    this.deleteCoinFromWatchlist(coinId)
      .then(this.fetchWatchlist)
      .then(({ result: watchList }) => {
        const rowData = this.combineCoinsWithWatchList(
          this.props.coins,
          watchList,
        )

        this.setState({
          watchList,
          rowData,
        })
      })

  public combineCoinsWithWatchList(coins, watchList) {
    coins = coins || []

    const enhancedCoins = watchList
      ? coins.map((coin) => {
          const isWatched = _.findIndex(watchList, (id) => coin.id === id) >= 0

          return {
            ...coin,
            isWatched,
          }
        })
      : [...coins]

    return enhancedCoins
  }

  public render() {
    const { isMobile, isLoggedIn, classes, pageCount } = this.props
    const pagesToShow = isMobile ? 7 : 10

    return (
      <div className={classes.root}>
        <Grid container={true} className={classes.headerContainer}>
          <Grid item={true} xs={12} md={9} className={classes.titleWrapper}>
            <Typography variant="h1" align="center" className={classes.title}>
              Cryptocurrency Prices Live
            </Typography>
            <a href="/coins?page=2" className={classes.nextLink}>
              See more
            </a>
          </Grid>
          <Grid item={true} xs={12} md={3} className={classes.search}>
            <Paper
              square={true}
              elevation={0}
              className={classes.searchWrapper}
            >
              <SearchCoins
                onSelect={(suggestion) =>
                  (window.location.href = `/coins/${suggestion.slug}`)
                }
                unstyled={true}
              />
            </Paper>
          </Grid>
        </Grid>

        {isMobile ? (
          <Table padding="none" className={classes.mobileTableContainer}>
            <TableHead>
              <TableRow className={classes.tableHeader}>
                <TableCell className={classes.watchedColumnHeader} />
                <TableCell className={classes.rankingColumnHeader}>#</TableCell>
                <TableCell className={classes.coinColumnHeader}>
                  <Grid
                    container={true}
                    direction="row"
                    alignContent="flex-start"
                    alignItems="stretch"
                    wrap="nowrap"
                    className={classes.coinWrapper}
                  >
                    <Grid item={true} className={classes.coinIcon} />
                    <Grid item={true}>Coin</Grid>
                  </Grid>
                </TableCell>
                <TableCell className={classes.priceColumnHeader}>
                  Price
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.rowData.map((row) => {
                const {
                  id,
                  isWatched,
                  ranking,
                  price,
                  market_cap,
                  volume24h,
                  name,
                  symbol,
                  slug,
                  image_url,
                } = row

                const { currencyRate, currencySymbol } = this.props

                const formattedPrice =
                  typeof price !== 'undefined'
                    ? `${currencySymbol}${formatPrice(price * currencyRate)}`
                    : ''
                const formattedMarketCap =
                  typeof market_cap !== 'undefined'
                    ? `${currencySymbol}${formatAbbreviatedPrice(
                        market_cap * currencyRate,
                      )}`
                    : ''
                const formattedVolume =
                  typeof volume24h !== 'undefined'
                    ? `${currencySymbol}${formatVolume(
                        volume24h * currencyRate,
                      )}`
                    : ''

                return (
                  <TableRow key={id}>
                    <TableCell className={classes.watchedColumn}>
                      <WatchStar
                        coin={row}
                        loggedIn={isLoggedIn}
                        hasText={false}
                      />
                    </TableCell>
                    <TableCell className={classes.rankingColumn}>
                      {ranking}
                    </TableCell>
                    <TableCell className={classes.coinColumn}>
                      <Grid
                        container={true}
                        direction="row"
                        alignContent="flex-start"
                        alignItems="stretch"
                        wrap="nowrap"
                        className={classes.coinWrapper}
                      >
                        <Grid item={true} className={classes.coinIcon}>
                          <LazyLoadImage
                            containerProps={{ height: 32 }}
                            alt={name}
                            src={image_url}
                          />
                        </Grid>
                        <Grid item={true}>
                          <Grid container={true}>
                            <Grid
                              item={true}
                              xs={12}
                              className={classes.coinTitle}
                            >
                              <a href={`/coins/${slug}`}>{name}</a>
                              <span className={classes.coinSymbol}>
                                {' '}
                                [{symbol}]
                              </span>
                            </Grid>
                            <Grid item={true} xs={12}>
                              <Grid container={true}>
                                <Grid item={true} xs={3}>
                                  <Grid
                                    container={true}
                                    className={classes.coinDetailsLeft}
                                  >
                                    <Grid item={true}>Mkt Cap</Grid>
                                    <Grid item={true}>Volume</Grid>
                                  </Grid>
                                </Grid>
                                <Grid item={true}>
                                  <Grid
                                    container={true}
                                    className={classes.coinDetailsRight}
                                  >
                                    <Grid item={true}>
                                      {formattedMarketCap}
                                    </Grid>
                                    <Grid item={true}>{formattedVolume}</Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </TableCell>
                    <TableCell className={classes.priceColumn}>
                      <div>{formattedPrice}</div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <div className={classes.desktopTableContainer}>
            <div
              className="ag-theme-material"
              style={{
                width: '100%',
              }}
            >
              <AgGridReact
                enableSorting={true}
                suppressCellSelection={true}
                domLayout="autoHeight"
                columnDefs={this.state.columnDefs}
                rowData={this.state.rowData}
                context={this.state.context}
                frameworkComponents={this.state.frameworkComponents}
                onGridReady={this.onGridReady}
                gridOptions={{ headerHeight: 30 }}
              />
            </div>
          </div>
        )}

        {!!pageCount && (
          <Grid
            container={true}
            wrap="nowrap"
            className={classes.footerContainer}
          >
            <Pagination pagesToShow={pagesToShow} pageCount={pageCount} />
          </Grid>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(withCurrency(CoinTable))
