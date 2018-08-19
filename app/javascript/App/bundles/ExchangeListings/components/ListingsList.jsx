import React, { Component } from 'react'
import ListingItem from './ListingItem'
import LoadingIndicator from '../../../../App/components/LoadingIndicator'
import localAPI from '../../../lib/localAPI'
import InfiniteScroll from 'react-infinite-scroll-component'

class ListingsList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      listings: props.initialListings,
      newestDetectedAt: props.initialListings[0].detected_at,
      oldestDetectedAt:
        props.initialListings[props.initialListings.length - 1].detected_at,
      hasMore: true,
    }
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

  render() {
    const { listings } = this.state
    return (
      <div id="listings-feed" className="overflow-y-hidden overflow-y-auto-m">
        <InfiniteScroll
          dataLength={listings.length}
          loader={<LoadingIndicator />}
          next={this.fetchOlderExchangeListings}
          hasMore={this.state.hasMore}
          scrollableTarget="listings-feed"
          endMessage={
            <p className="tc">
              <b>No more exchange listings present in the database.</b>
            </p>
          }
        >
          {listings.map((listing) => {
            return <ListingItem key={listing.id} listing={listing} />
          })}
        </InfiniteScroll>
      </div>
    )
  }
}

export default ListingsList
