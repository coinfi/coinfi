import * as React from 'react'
import * as _ from 'lodash'
import compose from 'recompose/compose'
import withWidth, { isWidthDown } from '@material-ui/core/withWidth'
import { AgGridReact } from 'ag-grid-react'
import ColumnNames from './ColumnNames'
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Grid,
  createStyles,
  withStyles,
} from '@material-ui/core'
import Icon from '~/bundles/common/components/Icon'
import {
  formatAbbreviatedPrice,
  formatValue,
} from '~/bundles/common/utils/numberFormatters'

interface Props {
  classes: any
  width: any
  coins: CoinData[]
  watchList: number[]
  loggedIn: boolean
}

interface State {
  currency: string
  columnDefs: any
  rowData: EnhancedCoinData[]
}

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

interface EnhancedCoinData extends CoinData {
  isWatched: boolean
}

const styles = (theme) =>
  createStyles({
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
  })

class HomeIndex extends React.Component<Props, State> {
  public api
  public columnApi

  constructor(props) {
    super(props)

    // combine stars with coins
    const coins = props.coins || []
    const enhancedCoins = props.watchList
      ? coins.map((coin) => {
          const isWatched =
            _.findIndex(props.watchList, (id) => coin.id === id) >= 0

          return {
            ...coin,
            isWatched,
          }
        })
      : [...props.coins]

    const currency = 'USD'
    this.state = {
      currency,
      columnDefs: ColumnNames(currency),
      rowData: enhancedCoins,
    }
  }

  public onGridReady = (params) => {
    this.api = params.api
    this.columnApi = params.columnApi

    this.api.sizeColumnsToFit()
  }

  public render() {
    const isMobile = isWidthDown('sm', this.props.width)

    if (isMobile) {
      const { currency } = this.state
      const { classes } = this.props
      const currencyKey = currency.toLowerCase()

      return (
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
              <TableCell className={classes.priceColumnHeader}>Price</TableCell>
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
                  ? `$${formatValue(price[currencyKey], 4)}`
                  : ''
              const formattedMarketCap =
                typeof market_cap !== 'undefined'
                  ? `$${formatAbbreviatedPrice(market_cap[currencyKey])}`
                  : ''
              const formattedVolume =
                typeof volume24 !== 'undefined'
                  ? `$${formatAbbreviatedPrice(volume24[currencyKey])}`
                  : ''

              return (
                <TableRow key={id}>
                  <TableCell className={classes.watchedColumn}>
                    <Icon
                      name="star"
                      solid={isWatched}
                      light={!isWatched}
                      className={isWatched ? 'aqua' : 'light-silver'}
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
      )
    }

    return (
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          height: '100%',
          display: 'flex',
          flex: 1,
        }}
      >
        <div
          className="ag-theme-material"
          style={{
            width: '100%',
          }}
        >
          <AgGridReact
            enableSorting={true}
            suppressCellSelection={true}
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            onGridReady={this.onGridReady}
          />
        </div>
      </div>
    )
  }
}

export default compose(
  withWidth(),
  withStyles(styles),
)(HomeIndex)
