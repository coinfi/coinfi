import React, { Component } from 'react'
import ListingItem from './ListingItem'
import LoadingIndicator from '../../../../App/components/LoadingIndicator'
import InfiniteScroll from 'react-infinite-scroll-component'

class ListingsList extends Component {

  render() {
    const { listings, hasMore } = this.props
    return (
      <div id="listings-feed" className="overflow-y-hidden overflow-y-auto-m">
        <InfiniteScroll
          dataLength={listings.length}
          loader={<LoadingIndicator />}
          next={this.fetchOlderExchangeListings}
          hasMore={hasMore}
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
