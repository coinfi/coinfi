import React, { Component } from 'react'
import ListingItem from './ListingItem'
import LoadingIndicator from '../../common/components/LoadingIndicator'
import InfiniteScroll from 'react-infinite-scroll-component'

class ListingsList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      listings,
      hasMore,
      fetchOlderExchangeListings,
      isLoading,
    } = this.props
    if (isLoading) {
      return (
        <div className="pa3 tc mt4">
          <LoadingIndicator />
        </div>
      )
    }
    const mappedItems = listings.map((listing) => {
      return <ListingItem key={listing.id} listing={listing} />
    })
    return (
      <div
        id="newsfeed"
        className="flex-auto relative overflow-y-scroll overflow-y-auto-m"
      >
        <InfiniteScroll
          dataLength={mappedItems.length}
          loader={<LoadingIndicator />}
          next={fetchOlderExchangeListings}
          hasMore={hasMore}
          scrollableTarget="newsfeed"
          endMessage={
            <p className="tc">
              <b>No more exchange listings present in the database.</b>
            </p>
          }
        >
          {mappedItems}
        </InfiniteScroll>
      </div>
    )
  }
}

export default ListingsList
