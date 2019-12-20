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
import { foam, brightGray, white } from '~/bundles/common/styles/colors'
import { sp2 } from '~/bundles/common/styles/spacing'
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
    tooltipped: {
      position: 'relative',
      '&:hover': {
        '& $tooltip': {
          visibility: 'visible',
          pointerEvents: 'auto',
          opacity: 1,
          '&:not(:last-child)': {
            transform: 'translate(-50%, -10px)',
            WebkitTransform: 'translate(-50%, -10px)',
          },
          '&:last-child': {
            transform: 'translate(-50%, 10px)',
            WebkitTransform: 'translate(-50%, 10px)',
          },
          '&$fromRight': {
            transform: 'translate(10px, -50%)',
            WebkitTransform: 'translate(10px, -50%)',
          },
        },
      },
    },
    tooltip: {
      fontSize: '0.8rem',
      textAlign: 'center',
      fontStyle: 'normal',
      position: 'absolute',
      left: '50%',
      maxWidth: '150px',
      background: brightGray,
      color: white,
      borderEadius: '2px',
      WebkitBorderRadius: '2px',
      padding: sp2,
      zIndex: 5,
      pointerEvents: 'none',
      visibility: 'hidden',
      opacity: 0,
      transition: '0.2s ease-out',
      WebkitTransition: '0.2s ease-out',
      bottom: '102%',
      transform: 'translate(-50%, 0px)',
      WebkitTransform: 'translate(-50%, 0px)',
      whiteSpace: 'nowrap',
      lineHeight: 1,
      '&:before': {
        content: '""',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        WbkitTransform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: '4px',
        borderColor: `${brightGray} transparent transparent transparent`,
        top: '100%',
      },
      '&:last-child': {
        bottom: 'initial',
        top: '102%',
        '&:before': {
          top: 'initial',
          bottom: '100%',
          borderColor: `transparent transparent ${brightGray} transparent`,
        },
      },
      '&$fromRight': {
        bottom: 'auto',
        left: '90%',
        top: '50%',
        transform: 'translate(0px, -50%)',
        WebkitTransform: 'translate(0px, -50%)',
        '&:before': {
          left: 0,
          top: '50%',
          bottom: 'initial',
          borderColor: `transparent ${brightGray} transparent transparent`,
          transform: 'translate(-100%, -50%)',
          WebkitTransform: 'translate(-100%, -50%)',
        },
      },
    },
    fromRight: {},
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
    return tpl && args ? tpl.replace(/\${(\w+)}/g, (x, v) => args[v]) : tpl
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
            linkToCoinNews: `<a href="/coins/${coinWithDetails.slug}">${
              coinWithDetails.name
            }</a>`,
            marketCap,
            currency,
            currencySymbol,
            volume24h,
          })

          return (
            <div className={classes.root}>
              <div className={classes.coinWrapper}>
                <span className="f4 fw6 flex items-center color-inherit">
                  {coinWithDetails.image_url && (
                    <img
                      className="w2e h2e mr3"
                      src={coinWithDetails.image_url}
                      alt=""
                    />
                  )}
                  <h1 className="f4 fw6">
                    {coinWithDetails.name} ({coinWithDetails.symbol}) News
                  </h1>
                </span>
                <div className={classes.tooltipped}>
                  <WatchStar
                    coin={coinWithDetails}
                    loggedIn={loggedIn}
                    hasText={true}
                  />
                  {!loggedIn && (
                    <div className={classes.tooltip}>Login to watch</div>
                  )}
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

              <p
                className="mt3 mb4"
                dangerouslySetInnerHTML={{ __html: summary }}
              />

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
