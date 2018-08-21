import React, { Component, Fragment } from 'react'
import debounce from 'debounce'
import LayoutDesktop from '../../components/LayoutDesktop'
import LayoutTablet from '../../components/LayoutTablet'
import LayoutMobile from '../../components/LayoutMobile'
import ListingsHeader from './components/ListingsHeader'
import ListingsList from './components/ListingsList'
import BodySection from './components/BodySection'

class ExchangeListingsPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      listings: props.initialListings,
      newestDetectedAt:
        props.initialListings[0] && props.initialListings[0].detected_at,
      oldestDetectedAt:
        props.initialListings[props.initialListings.length - 1] &&
        props.initialListings[props.initialListings.length - 1].detected_at,
      hasMore: true,
      showFilterPanel: false,
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

  toggleFilterPanel = () =>
    this.setState({
      showFilterPanel: !this.state.showFilterPanel,
    })

  applyFilters = () => {
    console.log('apply')
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
                applyFilters={this.applyFilters}
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
