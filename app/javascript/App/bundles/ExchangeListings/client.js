import React, { Component, Fragment } from 'react'
import debounce from 'debounce'
import LayoutDesktop from '../../components/LayoutDesktop'
import LayoutTablet from '../../components/LayoutTablet'
import LayoutMobile from '../../components/LayoutMobile'
import ListingsHeader from './components/ListingsHeader'
import ListingsList from './components/ListingsList'
import BodySection from './components/BodySection'
import localAPI from '../../lib/localAPI'

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
      exchangeSlugs: [],
      detectedSince: null,
      detectedUntil: null,
    }
  }

  componentDidMount() {
    window.addEventListener('resize', debounce(() => this.forceUpdate(), 500))
  }

  componentDidUpdate() {
    // TODO: Get this working!
    const timer = setInterval(() => {
      this.fetchNewerExchangeListings()
    }, 6000)
    clearInterval(timer)
  }

  // TODO: implement these methods
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
        ? '&detectedSince=' + this.state.detectedSince
        : ''
    const detectedUntilStr =
      this.state.detectedUntil !== null
        ? '&detectedUntil=' + this.state.detectedUntil
        : ''
    const urlParams =
      `/exchange_listings?` +
      `quoteSymbols=${quoteSymbolArg}&` +
      `exchangeSlugs=${exchangeSlugArgs || ''}&` +
      detectedSinceStr +
      detectedUntilStr

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

  componentDidMount() {
    window.addEventListener('resize', this.updateOnResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateOnResize)
  }

  updateOnResize = () => debounce(() => this.forceUpdate(), 500)

  toggleFilterPanel = () => {
    this.setState((state) => ({
      showFilterPanel: !this.state.showFilterPanel,
    }))
  }

  applyFilters = () => {
    this.fetchListingsBySymbol()
  }

  render() {
    const props = this.props
    const { listings, hasMore } = this.state
    const selectedItems = {
      detectedSince: this.state.detectedSince,
      detectedUntil: this.state.detectedUntil,
    }

    if (window.isMobile) {
      return (
        <LayoutMobile
          {...props}
          mainSection={
            <Fragment>
              <ListingsHeader
                {...props}
                showFilterPanel={this.state.showFilterPanel}
                toggleFilterPanel={this.toggleFilterPanel}
                applyFilters={() => this.applyFilters()}
                changeSymbol={this.changeSymbol}
                changeExchange={this.changeExchange}
                filterDates={this.filterDates}
                selectedItems={selectedItems}
              />
              <ListingsList
                {...props}
                listings={listings}
                hasMore={hasMore}
                fetchOlderExchangeListings={this.fetchOlderExchangeListings}
              />
            </Fragment>
          }
          modalName="listingsModal"
          modalSection={<BodySection {...props} mobileLayout />}
          drawerSection={null}
        />
      )
    } else if (window.isTablet) {
      return (
        <LayoutTablet
          {...props}
          leftSection={
            <Fragment>
              <ListingsHeader
                {...props}
                showFilterPanel={this.state.showFilterPanel}
                toggleFilterPanel={this.toggleFilterPanel}
                applyFilters={() => this.applyFilters()}
                changeSymbol={this.changeSymbol}
                changeExchange={this.changeExchange}
                filterDates={this.filterDates}
                selectedItems={selectedItems}
              />
              <ListingsList
                {...props}
                listings={listings}
                hasMore={hasMore}
                fetchOlderExchangeListings={this.fetchOlderExchangeListings}
              />
            </Fragment>
          }
          rightSection={<BodySection {...props} />}
          drawerSection={null}
        />
      )
    } else {
      return (
        <LayoutDesktop
          leftSection={null}
          centerSection={
            <Fragment>
              <ListingsHeader
                showFilterPanel={this.state.showFilterPanel}
                toggleFilterPanel={this.toggleFilterPanel}
                applyFilters={() => this.applyFilters()}
                changeSymbol={this.changeSymbol}
                changeExchange={this.changeExchange}
                filterDates={this.filterDates}
                selectedItems={selectedItems}
              />
              <ListingsList
                {...props}
                listings={listings}
                hasMore={hasMore}
                fetchOlderExchangeListings={this.fetchOlderExchangeListings}
              />
            </Fragment>
          }
          rightSection={<BodySection {...props} />}
          {...props}
        />
      )
    }
  }
}

export default ExchangeListingsPage
