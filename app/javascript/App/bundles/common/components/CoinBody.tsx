import * as React from 'react'
import * as _ from 'lodash'
import CoinCharts from './CoinCharts'
import Currency from './Currency'
import PercentageChange from './PercentageChange'
import WatchStar from '~/bundles/common/components/WatchStar'
import NewsRelatedCoinList from './NewsRelatedCoinList'
import LoadingIndicator from './LoadingIndicator'
import localAPI from '../utils/localAPI'
import { withStyles, createStyles } from '@material-ui/core/styles'
import CurrencyContext, {
  CurrencyContextType,
} from '~/bundles/common/contexts/CurrencyContext'
import { formatAbbreviatedPrice } from '~/bundles/common/utils/numberFormatters'
import { foam, brightGray } from '~/bundles/common/styles/colors'

import { CoinWithDetails } from '../types'

const styles = (theme) =>
  createStyles({
    root: {
      padding: '2rem',
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      '& h1, h2, h3, h4, h5': {
        color: `${_.get(
          theme,
          ['palette', 'text', 'heading'],
          brightGray,
        )} !important`,
      },
    },
    coinWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },
    marketCap: {
      fontSize: '0.875rem',
      marginTop: '0.5rem',
      padding: '0.25rem 0.5rem',
      backgroundColor: _.get(
        theme,
        ['palette', 'background', 'selected'],
        foam,
      ),
      display: 'inline-block',
    },
    relatedCoinList: {
      listStyle: 'none',
      paddingLeft: 0,
    },
    relatedCoinItem: {},
  })

interface Props {
  classes: any
  initialCoinWithDetails?: CoinWithDetails
  coinSlug?: string
  loggedIn: boolean
}

interface State {
  coinWithDetails: CoinWithDetails
}

class CoinBody extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      coinWithDetails: props.initialCoinWithDetails || null,
    }
  }

  public componentDidMount() {
    if (this.props.coinSlug) {
      this.fetchCoinDetails()
    }
  }

  public componentDidUpdate(prevProps, prevState, snapshot) {
    // Check if coin is unselected
    if (!this.props.coinSlug && prevState.coinWithDetails) {
      // coinSlug prop turns null
      this.setState({ coinWithDetails: null })
    }

    // Check if coin is selected/changed
    if (prevProps.coinSlug !== this.props.coinSlug) {
      // coinSlug prop changed
      this.setState({ coinWithDetails: null }, () => this.fetchCoinDetails())
    }
  }

  public fetchCoinDetails() {
    localAPI.get(`/coins/by-slug/${this.props.coinSlug}`).then((response) => {
      this.setState({
        coinWithDetails: response.payload,
      })
    })
  }

  public parseSummary(tpl, args) {
    return tpl.replace(/\${(\w+)}/g, (x, v) => args[v])
  }

  public render() {
    const { loggedIn, classes } = this.props
    const { coinWithDetails } = this.state

    if (!coinWithDetails) {
      return (
        <div className="pa3 tc mt4">
          <LoadingIndicator />
        </div>
      )
    }

    return (
      <CurrencyContext.Consumer>
        {({ currency, currencyRate, currencySymbol }: CurrencyContextType) => {
          const price =
            parseFloat(
              _.get(coinWithDetails, ['market_info', 'price_usd'], 0),
            ) * currencyRate
          const percentChange = _.get(
            coinWithDetails,
            ['market_info', 'change24h'],
            0,
          )
          const volume24h = formatAbbreviatedPrice(
            _.get(coinWithDetails, ['market_info', 'volume24h'], 0) *
              currencyRate,
          )
          const marketCap = formatAbbreviatedPrice(
            _.get(coinWithDetails, ['market_info', 'market_cap'], 0) *
              currencyRate,
          )
          const summary = this.parseSummary(coinWithDetails.summary, {
            marketCap,
            currency,
            currencySymbol,
            volume24h,
          })

          return (
            <div className={classes.root}>
              <div className={classes.coinWrapper}>
                <a
                  href={`/coins/${coinWithDetails.slug}`}
                  className="f4 fw6 flex items-center color-inherit"
                >
                  {coinWithDetails.image_url && (
                    <img
                      className="w2e h2e mr3"
                      src={coinWithDetails.image_url}
                      alt=""
                    />
                  )}
                  {coinWithDetails.name}
                  <span className="mh2">({coinWithDetails.symbol})</span>
                  News
                </a>
                <div className="tooltipped">
                  <WatchStar
                    coin={coinWithDetails}
                    loggedIn={loggedIn}
                    hasText={true}
                  />
                  {!loggedIn && <div className="tooltip">Login to watch</div>}
                </div>
              </div>
              <div className="min-h12e flex items-center justify-center">
                <div className="tc">
                  <div className="flex items-center">
                    <span className="f2">
                      <Currency currency={currency}>
                        {price.toString()}
                      </Currency>
                    </span>
                    <span className="ml2">
                      <PercentageChange
                        value={percentChange}
                        className="b db"
                      />
                    </span>
                  </div>
                  <div className={classes.marketCap}>
                    {`Market: ${currencySymbol}${marketCap}`}
                  </div>
                </div>
              </div>
              <CoinCharts
                coinObj={coinWithDetails}
                priceData={coinWithDetails.prices_data}
                // priceDataHourly={coinWithDetails.hourly_prices_data}
                annotations={coinWithDetails.news_data}
                isTradingViewVisible={true}
              />

              <p className="mt3 mb4">{summary}</p>

              <div className="mb3">
                <h2 className="f5">Read Related News</h2>
                <NewsRelatedCoinList
                  relatedCoinsData={coinWithDetails.related_coins_data}
                />
              </div>
            </div>
          )
        }}
      </CurrencyContext.Consumer>
    )
  }
}

export default withStyles(styles)(CoinBody)
