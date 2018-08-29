import React, { Component, Fragment } from 'react'
import debounce from 'debounce'
import LayoutDesktop from '~/components/LayoutDesktop'
import LayoutTablet from '~/components/LayoutTablet'
import LayoutMobile from '~/components/LayoutMobile'
import ListingsHeader from './components/ListingsHeader'
import ListingsList from './components/ListingsList'
import BodySection from './components/BodySection'
import localAPI from '~/lib/localAPI'
import ExchangeListingsContext from '~/bundles/ExchangeListings/context'

class ExchangeListingsPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
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
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.fetchNewerExchangeListings()
    }, 60000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  fetchNewerExchangeListings = () => {
    console.log('Fetching newer exchange listings...')
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

  fetchOlderExchangeListings = () => {
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

  filterDates = (data) => {
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

  changeSymbol = (data) => {
    const selectedSymbols = data.map((item) => item.value)

    this.setState({
      selectedSymbols: selectedSymbols,
    })
  }

  changeExchange = (data) => {
    const selectedExchanges = data.map((item) => item.value)
    this.setState({
      selectedExchanges: selectedExchanges,
    })
  }

  fetchListingsBySymbol = () => {
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
      })
      if (!response.payload.length) {
        this.setState({
          hasMore: false,
        })
      }
      this.toggleFilterPanel()
    })
  }

  updateOnResize = () => debounce(() => this.forceUpdate(), 500)

  toggleFilterPanel = () => {
    this.setState((prevState) => ({
      showFilterPanel: !prevState.showFilterPanel,
    }))
  }

  applyFilters = () => {
    this.fetchListingsBySymbol()
  }

  resetFilters = () => {
    this.setState({
      detectedSince: null,
      detectedUntil: null,
      selectedSymbols: [],
      selectedExchanges: [],
    })
  }

  render() {
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
      selectedItems: selectedItems,
      selectedSymbols: this.state.selectedSymbols,
      selectedExchanges: this.state.selectedExchanges,
      exchangeSlugs: this.state.exchangeSlugs,
      resetFilters: this.resetFilters,
    }

    if (window.isMobile) {
      return (
        <LayoutMobile
          mainSection={
            <Fragment>
              <ExchangeListingsContext.Provider value={context}>
                <ListingsHeader showFilterPanel={this.state.showFilterPanel} />
              </ExchangeListingsContext.Provider>
              <ListingsList
                listings={listings}
                hasMore={hasMore}
                fetchOlderExchangeListings={this.fetchOlderExchangeListings}
              />
            </Fragment>
          }
          modalName="listingsModal"
          modalSection={<BodySection mobileLayout />}
          drawerSection={null}
        />
      )
    } else if (window.isTablet) {
      return (
        <LayoutTablet
          {...props}
          leftSection={
            <Fragment>
              <ExchangeListingsContext.Provider value={context}>
                <ListingsHeader showFilterPanel={this.state.showFilterPanel} />
              </ExchangeListingsContext.Provider>
              <ListingsList
                listings={listings}
                hasMore={hasMore}
                fetchOlderExchangeListings={this.fetchOlderExchangeListings}
              />
            </Fragment>
          }
          rightSection={<BodySection />}
          drawerSection={null}
        />
      )
    } else {
      return (
        <LayoutDesktop
          leftSection={null}
          centerSection={
            <Fragment>
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
              />
            </Fragment>
          }
          rightSection={<BodySection />}
        />
      )
    }
  }
}

export default ExchangeListingsPage
