import * as React from 'react'
import * as _ from 'lodash'
import LayoutDesktop from '~/bundles/common/components/LayoutDesktop'
import LayoutMobile from '~/bundles/common/components/LayoutMobile'
import ListingsHeader from './components/ListingsHeader'
import ListingsList from './components/ListingsList'
import BodySection from './components/BodySection'
import localAPI from '../common/utils/localAPI'
import ExchangeListingsContext, {
  ExchangeListingsContextType,
} from './ExchangeListingsContext'
import CoinListWrapper from '~/bundles/common/components/CoinListWrapper'
import CoinListDrawer from '~/bundles/common/components/CoinListDrawer'
import { Coin } from '~/bundles/common/types'
import { Listing } from '~/bundles/ExchangeListings/types'
import withDevice from '~/bundles/common/utils/withDevice'

type ActiveMobileWindow = 'Modal' | 'CoinsList' | 'BodySection' | 'None'

interface Props {
  loggedIn: boolean
  selectedCoinSlug: string | null
  selectCoinBySlug: (coinSlug: string) => void
  watchlist: Coin[]
  getWatchlist: () => Coin[]
  quoteSymbols: string[]
  exchanges: string[]
  initialListings: Listing[]
  isMobile: boolean
}

interface State {
  ActiveMobileWindow: ActiveMobileWindow
  listings: Listing[]
  newestDetectedAt: string
  oldestDetectedAt: string
  hasMore: boolean
  showFilterPanel: boolean
  selectedSymbols: string[]
  selectedExchanges: string[]
  exchangeSlugs: string[]
  detectedSince: string | null
  detectedUntil: string | null
  status: string
}

const STATUSES = {
  LOADING: 'LOADING',
  READY: 'READY',
}

class ExchangeListingsPage extends React.Component<Props, State> {
  private interval: any

  constructor(props) {
    super(props)

    this.state = {
      ActiveMobileWindow: 'None',
      listings: props.initialListings,
      newestDetectedAt: props.initialListings[0].detected_at,
      oldestDetectedAt:
        props.initialListings[props.initialListings.length - 1].detected_at,
      hasMore: true,
      showFilterPanel: false,
      selectedSymbols: [],
      selectedExchanges: [],
      exchangeSlugs: [],
      detectedSince: null,
      detectedUntil: null,
      status: STATUSES.READY,
    }
  }

  public componentDidMount() {
    this.interval = setInterval(() => {
      this.fetchNewerExchangeListings()
    }, 60000)
  }

  public componentWillUnmount() {
    clearInterval(this.interval)
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.selectedCoinSlug !== this.props.selectedCoinSlug) {
      this.setState(
        {
          status: STATUSES.LOADING,
        },
        () => {
          this.fetchCoinDetails(this.props.selectedCoinSlug).then((result) => {
            this.setState(
              {
                selectedSymbols: [result.symbol],
              },
              () => this.fetchListingsBySymbol(),
            )
          })
        },
      )
    }
  }

  public uniqListings = (arr: Listing[]) => {
    return _.uniqBy(arr, (elem) => elem.id)
  }

  public fetchCoinDetails = (coinSlug): Promise<Coin> =>
    localAPI
      .get(`/coins/by-slug/${coinSlug}`)
      .then((response) => response.payload)

  public fetchNewerExchangeListings = () => {
    localAPI
      .get(
        `/exchange_listings`,
        this.getParams({ detectedSince: this.state.newestDetectedAt }),
      )
      .then((response) => {
        if (response.payload.length) {
          this.setState({
            listings: this.uniqListings(
              response.payload.concat(this.state.listings),
            ),
            newestDetectedAt: response.payload[0].detected_at,
          })
        }
      })
  }

  public fetchOlderExchangeListings = () => {
    localAPI
      .get(
        `/exchange_listings`,
        this.getParams({ detectedUntil: this.state.oldestDetectedAt }),
      )
      .then((response) => {
        response.payload.length
          ? this.setState({
              listings: this.uniqListings(
                this.state.listings.concat(response.payload),
              ),
              oldestDetectedAt:
                response.payload[response.payload.length - 1].detected_at,
            })
          : this.setState({ hasMore: false })
      })
  }

  public filterDates = (data) => {
    if (data.detectedSince) {
      this.setState({
        detectedSince: data.detectedSince,
      })
    }
    if (data.detectedUntil) {
      this.setState({
        detectedUntil: data.detectedUntil,
      })
    }
  }

  public changeSymbol = (data) => {
    const selectedSymbols = data.map((item) => item.value)

    this.setState({
      selectedSymbols,
    })
  }

  public changeExchange = (data) => {
    const selectedExchanges = data.map((item) => item.value)
    this.setState({
      selectedExchanges,
    })
  }

  public getParams = (args) => {
    const result: any = {}

    if (!!this.state.selectedSymbols.length) {
      result.quoteSymbols = this.state.selectedSymbols
    }

    if (!!this.state.selectedExchanges.length) {
      result.exchangeSlugs = this.state.selectedExchanges
    }

    if (!!this.state.detectedSince) {
      result.detectedSince = this.state.detectedSince
    }

    if (!!this.state.detectedUntil) {
      result.detectedUntil = this.state.detectedUntil
    }

    return { ...result, ...args }
  }

  public fetchListingsBySymbol = () => {
    this.setState(
      {
        listings: [],
        hasMore: true,
      },
      () => {
        localAPI
          .get(`/exchange_listings`, this.getParams({}))
          .then((response) => {
            this.setState({
              listings: response.payload,
              status: STATUSES.READY,
            })
            if (!response.payload.length) {
              this.setState({
                hasMore: false,
              })
            }
          })
      },
    )
  }

  public closeFilterPanel = () => {
    if (!this.state.showFilterPanel) {
      return
    }

    this.setState((prevState) => ({
      showFilterPanel: false,
    }))
  }

  public toggleFilterPanel = () => {
    this.setState((prevState) => ({
      showFilterPanel: !prevState.showFilterPanel,
    }))
  }

  public applyFilters = () => {
    this.fetchListingsBySymbol()
    this.closeFilterPanel()
  }

  public resetFilters = () => {
    this.setState({
      detectedSince: null,
      detectedUntil: null,
      selectedSymbols: [],
      selectedExchanges: [],
    })
  }

  public render() {
    const props = this.props
    const { listings, hasMore } = this.state

    const context: ExchangeListingsContextType = {
      toggleFilterPanel: this.toggleFilterPanel,
      showFilterPanel: this.state.showFilterPanel,
      applyFilters: this.applyFilters,
      quoteSymbols: this.props.quoteSymbols,
      exchanges: this.props.exchanges,
      changeSymbol: this.changeSymbol,
      changeExchange: this.changeExchange,
      filterDates: this.filterDates,
      selectedItems: {
        detectedSince: this.state.detectedSince,
        detectedUntil: this.state.detectedUntil,
      },
      selectedSymbols: this.state.selectedSymbols,
      selectedExchanges: this.state.selectedExchanges,
      exchangeSlugs: this.state.exchangeSlugs,
      resetFilters: this.resetFilters,
    }

    if (props.isMobile) {
      return (
        <LayoutMobile
          mainSection={
            <>
              <ExchangeListingsContext.Provider value={context}>
                <ListingsHeader
                  showFilterPanel={this.state.showFilterPanel}
                  toggleFilterPanel={this.toggleFilterPanel}
                  showCoinListDrawer={() =>
                    this.setState({ ActiveMobileWindow: 'CoinsList' })
                  }
                  toggleNewsfeedTips={() =>
                    this.setState({ ActiveMobileWindow: 'Modal' })
                  }
                />
              </ExchangeListingsContext.Provider>
              <ListingsList
                listings={listings}
                hasMore={hasMore}
                fetchOlderExchangeListings={this.fetchOlderExchangeListings}
                isLoading={this.state.status === STATUSES.LOADING}
              />
            </>
          }
          modalSection={
            <BodySection
              mobileLayout={true}
              closeTips={() => this.setState({ ActiveMobileWindow: 'None' })}
            />
          }
          drawerSection={
            <CoinListDrawer
              isShown={this.state.ActiveMobileWindow === 'CoinsList'}
              onClose={() => this.setState({ ActiveMobileWindow: 'None' })}
              loggedIn={this.props.loggedIn}
              onClick={() => this.setState({ ActiveMobileWindow: 'None' })}
            />
          }
          showModal={this.state.ActiveMobileWindow === 'Modal'}
        />
      )
    } else {
      return (
        <LayoutDesktop
          leftSection={
            <CoinListWrapper
              loggedIn={this.props.loggedIn}
              isWatchlist={true}
            />
          }
          centerSection={
            <>
              <ExchangeListingsContext.Provider value={context}>
                <ListingsHeader
                  toggleFilterPanel={this.toggleFilterPanel}
                  showFilterPanel={this.state.showFilterPanel}
                />
              </ExchangeListingsContext.Provider>
              <ListingsList
                listings={listings}
                hasMore={hasMore}
                fetchOlderExchangeListings={this.fetchOlderExchangeListings}
                isLoading={this.state.status === STATUSES.LOADING}
              />
            </>
          }
          rightSection={<BodySection />}
        />
      )
    }
  }
}

export default withDevice(ExchangeListingsPage)
