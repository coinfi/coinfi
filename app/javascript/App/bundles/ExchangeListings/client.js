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
  /*  TODO: implement these methods
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
      .get(`/exchange_listigs?detectedUntil=${this.state.oldestDetectedAt}`)
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
  */

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
    }
  }

  componentDidUpdate() {
    window.addEventListener('resize', debounce(() => this.forceUpdate(), 500))
  }

  componentDidUpdate() {
    // TODO: Get this working!
    const timer = setInterval(() => {
      this.fetchNewerExchangeListings()
    }, 6000)
    clearInterval(timer)
  }

  changeSymbol = (data) => {
    const selectedSymbols = data.map((item) => item.value)
    this.setState({
      selectedSymbols: selectedSymbols,
    })
  }

  changeExchange = (data) => {
    const selectedExchanges = data.map((item) => item.label.toLowerCase()) // TODO: api should return value but its empty
    this.setState({
      selectedExchanges: selectedExchanges,
    })
  }

  fetchListingsBySymbol = () => {
    const quoteSymbolArg = this.state.selectedSymbols
    const exchangeSlugArgs = this.state.selectedExchanges
    localAPI
      .get(
        `/exchange_listings?quoteSymbols=${quoteSymbolArg}&exchangeSlugs=${exchangeSlugArgs}`,
      )
      .then((response) => {
        this.setState({
          listings: response.payload,
        })
        this.toggleFilterPanel()
      })
  }

  toggleFilterPanel = () =>
    this.setState({
      showFilterPanel: !this.state.showFilterPanel,
    })

  applyFilters = () => {
    this.fetchListingsBySymbol()
  }

  render() {
    const props = this.props
    const { listings, hasMore } = this.state

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
              />
              <ListingsList {...props} />
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
                applyFilters={this.applyFilters}
              />
              <ListingsList {...props} />
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
                {...props}
                showFilterPanel={this.state.showFilterPanel}
                toggleFilterPanel={this.toggleFilterPanel}
                applyFilters={() => this.applyFilters()}
                changeSymbol={this.changeSymbol.bind(this)}
                changeExchange={this.changeExchange.bind(this)}
              />
              <ListingsList {...props} listings={listings} hasMore={hasMore} />
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
