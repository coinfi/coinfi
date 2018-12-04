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
  Button,
} from '@material-ui/core'
import ColumnNames from './ColumnNames'
import {
  formatAbbreviatedPrice,
  formatValue,
} from '~/bundles/common/utils/numberFormatters'
import { CoinData, EnhancedCoinData } from './types'
import SearchCoins from '../common/components/SearchCoins'
import WatchStar from '../common/components/WatchStar'
import API from '../common/utils/API'
import coinsNormalizer from '../common/normalizers/coins'
import { watch } from 'fs'

interface Props {
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
    tableContainer: {
      width: '100%',
      maxWidth: '1200px',
      height: '100%',
      display: 'flex',
      flex: 1,
      [theme.breakpoints.up('md')]: {
        margin: '0 auto',
      },
    },
    headerContainer: {
      [theme.breakpoints.up('md')]: {
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
      },
    },
    title: {
      backgroundColor: '#fff',
      [theme.breakpoints.down('sm')]: {
        borderBottom: '1px solid #e5e8ed',
        paddingTop: `${theme.spacing.unit * 2}px !important`,
        paddingBottom: `${theme.spacing.unit}px !important`,
      },
    },
    search: {
      padding: `${theme.spacing.unit}px !important`,
      textAlign: 'center',
      [theme.breakpoints.up('md')]: {
        padding: `${theme.spacing.unit * 2}px !important`,
        backgroundColor: '#fff',
      },
    },
    searchWrapper: {
      padding: '10px',
    },
    nav: {
      backgroundColor: '#fff',
      paddingTop: `${theme.spacing.unit}px !important`,
      paddingBottom: `${theme.spacing.unit}px !important`,
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        borderBottom: '1px solid #e5e8ed',
      },
      [theme.breakpoints.up('md')]: {
        padding: `${theme.spacing.unit * 2}px !important`,
        textAlign: 'right',
      },
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
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
      width: '40px',
      fontSize: '0.6rem',
    },
    coinDetailsRight: {
      width: '40px',
      fontSize: '0.6rem',
      textAlign: 'right',
    },
    priceColumnHeader: {
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
      width: '100%',
      maxWidth: '1200px',
      [theme.breakpoints.up('md')]: {
        margin: `${theme.spacing.unit * 2}px auto`,
      },
      [theme.breakpoints.up('down')]: {
        margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px`,
      },
    },
    paginationButton: {
      backgroundColor: '#fff',
      minWidth: 'unset',
      minHeight: 'unset',
      marginLeft: `${theme.spacing.unit * 0.5}px`,
      marginRight: `${theme.spacing.unit * 0.5}px`,
      '&:first-child': {
        marginRight: 0,
      },
      '&:last-child': {
        marginRight: 0,
      },
    },
    paginationSpacer: {
      paddingLeft: `${theme.spacing.unit * 2}px`,
      paddingRight: `${theme.spacing.unit * 2}px`,
      lineHeight: '1.5rem',
    },
  })

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

    const currency = 'USD'
    this.state = {
      watchList: props.watchList,
      columnDefs: ColumnNames(currency),
      rowData: enhancedCoins,
      context: {
        componentParent: this,
        handleWatchStarClick: this.handleWatchStarClick,
      },
      frameworkComponents: {},
    }
  }

  public onGridReady = (params) => {
    this.api = params.api
    this.columnApi = params.columnApi

    this.api.sizeColumnsToFit()
  }

  // NOTE: Manually implementing watch button for now since ag-grid doesn't work well with context
  public handleWatchStarClick = (id, isWatched = false) => {
    if (!this.props.isLoggedIn) {
      window.location.href = '/login'
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
    const { isMobile, isLoggedIn, currency, classes, pageCount } = this.props
    const currencyKey = currency.toLowerCase()

    const pagesToShow = 10
    const buttons = Array(Math.min(pagesToShow, pageCount))
      .fill(null)
      .map((none, index) => index + 1)

    return (
      <React.Fragment>
        <Grid container={true} className={classes.headerContainer}>
          <Grid item={true} xs={12}>
            <Typography variant="h5" align="center" className={classes.title}>
              Cryptocurrency prices today
            </Typography>
          </Grid>
          <Grid item={true} xs={12} md={9} className={classes.search}>
            <Paper square={true} className={classes.searchWrapper}>
              <SearchCoins
                onSelect={(suggestion) =>
                  (window.location.href = `/coins/${suggestion.slug}`)
                }
                unstyled={true}
              />
            </Paper>
          </Grid>
          <Grid item={true} xs={12} md={3} className={classes.nav}>
            <a href="/coins?page=2">Next</a>
          </Grid>
        </Grid>

        {isMobile ? (
          <Table padding="none">
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
                  volume24,
                  name,
                  symbol,
                  slug,
                  image_url,
                } = row

                const formattedPrice =
                  typeof price !== 'undefined'
                    ? `$${formatValue(price, 4)}`
                    : ''
                const formattedMarketCap =
                  typeof market_cap !== 'undefined'
                    ? `$${formatAbbreviatedPrice(market_cap)}`
                    : ''
                const formattedVolume =
                  typeof volume24 !== 'undefined'
                    ? `$${formatAbbreviatedPrice(volume24)}`
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
                          <img alt={name} src={image_url} />
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
                            <Grid
                              item={true}
                              xs={3}
                              className={classes.coinDetailsLeft}
                            >
                              Mkt Cap
                            </Grid>
                            <Grid
                              item={true}
                              xs={3}
                              className={classes.coinDetailsRight}
                            >
                              {formattedMarketCap}
                            </Grid>
                            <Grid item={true} xs={6} />
                            <Grid
                              item={true}
                              xs={3}
                              className={classes.coinDetailsLeft}
                            >
                              Volume
                            </Grid>
                            <Grid
                              item={true}
                              xs={3}
                              className={classes.coinDetailsRight}
                            >
                              {formattedVolume}
                            </Grid>
                            <Grid item={true} xs={6} />
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
          <div className={classes.tableContainer}>
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
              />
            </div>
          </div>
        )}

        {!!pageCount && (
          <Grid
            container={true}
            justify="flex-end"
            className={classes.footerContainer}
          >
            {buttons.map((page) => (
              <Button
                variant="outlined"
                size="small"
                className={classes.paginationButton}
                key={page}
                href={`/coins?page=${page}`}
              >
                {page}
              </Button>
            ))}
            {pagesToShow < pageCount && (
              <React.Fragment>
                <span className={classes.paginationSpacer}>...</span>
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.paginationButton}
                  href={`/coins?page=${pageCount}`}
                >
                  {pageCount}
                </Button>
              </React.Fragment>
            )}
          </Grid>
        )}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CoinTable)
