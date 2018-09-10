import { IWindowScreenType } from '../common/types'
declare const window: IWindowScreenType

import * as React from 'react'
import debounce from 'debounce'
import LayoutDesktop from '../../components/LayoutDesktop'
import LayoutTablet from '../../components/LayoutTablet'
import LayoutMobile from '~/bundles/common/components/LayoutMobile'
import ListingsHeader from './components/ListingsHeader'
import ListingsList from './components/ListingsList'
import BodySection from './components/BodySection'
import localAPI from '../../lib/localAPI'
import ExchangeListingsContext from './context'
import CoinListWrapper from '~/bundles/common/components/CoinListWrapper'
import CoinListDrawer from '~/bundles/common/components/CoinListDrawer'
import { ICoin } from '~/bundles/common/types'
import { IListing } from '~/bundles/ExchangeListings/types'

type ActiveMobileWindow = 'Modal' | 'CoinsList' | 'BodySection' | 'None'

interface IProps {
  loggedIn: boolean
  selectedCoinSlug: string | null
  selectCoinBySlug: (coinSlug: string) => void
  watchlist: ICoin[]
  getWatchlist: () => ICoin[]
  quoteSymbols: string[]
  exchanges: string[]
  initialListings: IListing[]
}

interface IState {
  ActiveMobileWindow: ActiveMobileWindow
  listings: IListing[]
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

class ExchangeListingsPage extends React.Component<IProps, IState> {
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

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.selectedCoinSlug !== this.props.selectedCoinSlug) {
      this.setState({ status: STATUSES.LOADING })
      this.fetchCoinDetails(this.props.selectedCoinSlug).then((result) => {
        this.setState(
          {
            selectedSymbols: [result.symbol],
          },
          () => this.fetchListingsBySymbol(),
        )
      })
    }
  }

  public fetchCoinDetails = (coinSlug): Promise<ICoin> => {
    return new Promise((res, rej) => {
      localAPI.get(`/coins/by-slug/${coinSlug}`).then((response) => {
        res(response.payload)
      })
    })
  }

  public fetchNewerExchangeListings = () => {
    localAPI
      .get(`/exchange_listings?detectedSince=${this.state.newestDetectedAt}`)
      .then((response) => {
        if (response.payload.length) {
          this.setState({
            listings: response.payload.concat(this.state.listings),
            newestDetectedAt: response.payload[0].detected_at,
          })
        }
      })
  }

  public fetchOlderExchangeListings = () => {
    localAPI
      .get(`/exchange_listings?detectedUntil=${this.state.oldestDetectedAt}`)
      .then((response) => {
        response.payload.length
          ? this.setState({
              listings: this.state.listings.concat(response.payload),
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

  public fetchListingsBySymbol = () => {
    const quoteSymbolArg = this.state.selectedSymbols
    const exchangeSlugArgs = this.state.selectedExchanges
    const detectedSinceStr =
      this.state.detectedSince !== null
        ? `&detectedSince=${this.state.detectedSince}`
        : ''
    const detectedUntilStr =
      this.state.detectedUntil !== null
        ? `&detectedUntil=${this.state.detectedUntil}`
        : ''
    const urlParams = `${`/exchange_listings?` +
      `quoteSymbols=${quoteSymbolArg}&` +
      `exchangeSlugs=${exchangeSlugArgs ||
        ''}&`}${detectedSinceStr}${detectedUntilStr}`

    localAPI.get(urlParams).then((response) => {
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
  }

  public updateOnResize = () => debounce(() => this.forceUpdate(), 500)

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
    const selectedItems = {
      detectedSince: this.state.detectedSince,
      detectedUntil: this.state.detectedUntil,
    }

    const context = {
      toggleFilterPanel: this.toggleFilterPanel,
      showFilterPanel: this.state.showFilterPanel,
      applyFilters: () => this.applyFilters(),
      quoteSymbols: this.props.quoteSymbols,
      exchanges: this.props.exchanges,
      changeSymbol: this.changeSymbol,
      changeExchange: this.changeExchange,
      filterDates: this.filterDates,
      selectedItems,
      selectedSymbols: this.state.selectedSymbols,
      selectedExchanges: this.state.selectedExchanges,
      exchangeSlugs: this.state.exchangeSlugs,
      resetFilters: this.resetFilters,
    }

    if (window.isMobile) {
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
                  toggleNewsfeedTips={() => this.setState({ ActiveMobileWindow: 'Modal' })}
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
          modalSection={<BodySection mobileLayout={true} closeTips={() => this.setState({ ActiveMobileWindow: 'None' })} />}
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
    } else if (window.isTablet) {
      return (
        <LayoutTablet
          {...props}
          leftSection={
            <>
              <ExchangeListingsContext.Provider value={context}>
                <ListingsHeader showFilterPanel={this.state.showFilterPanel} />
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
          drawerSection={null}
        />
      )
    } else {
      return (
        <LayoutDesktop
          leftSection={
            <CoinListWrapper
              loggedIn={this.props.loggedIn}
              onClick={() => null}
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

export default ExchangeListingsPage
