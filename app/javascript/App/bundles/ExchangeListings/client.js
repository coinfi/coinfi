import React, { Component, Fragment } from 'react'
import debounce from 'debounce'
import LayoutDesktop from '../../components/LayoutDesktop'
import LayoutTablet from '../../components/LayoutTablet'
import LayoutMobile from '../../components/LayoutMobile'
import ListingsHeader from './components/ListingsHeader'
import ListingsList from './components/ListingsList'
import BodySection from './components/BodySection'

class ExchangeListingsPage extends Component {
  state = { showFilterPanel: false }

  toggleFilterPanel() {
    this.setState({
      showFilterPanel: !this.state.showFilterPanel,
    })
  }

  componentDidUpdate() {
    window.addEventListener('resize', debounce(() => this.forceUpdate(), 500))
  }

  render() {
    const props = this.props

    if (window.isMobile) {
      console.log('mobile')
      return (
        <LayoutMobile
          {...props}
          mainSection={
            <Fragment>
              <ListingsHeader
                {...props}
                showFilterPanel={this.state.showFilterPanel}
                toggleFilterPanel={this.toggleFilterPanel.bind(this)}
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
      console.log('tablet')
      return (
        <LayoutTablet
          {...props}
          leftSection={
            <Fragment>
              <ListingsHeader
                {...props}
                showFilterPanel={this.state.showFilterPanel}
                toggleFilterPanel={this.toggleFilterPanel.bind(this)}
              />
              <ListingsList {...props} />
            </Fragment>
          }
          rightSection={<BodySection {...props} />}
          drawerSection={null}
        />
      )
    } else {
      console.log('desktop')
      return (
        <LayoutDesktop
          leftSection={null}
          centerSection={
            <Fragment>
              <ListingsHeader
                {...props}
                showFilterPanel={this.state.showFilterPanel}
                toggleFilterPanel={this.toggleFilterPanel.bind(this)}
              />
              <ListingsList {...props} />
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
