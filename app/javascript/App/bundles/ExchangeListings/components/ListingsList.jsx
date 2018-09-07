import React, { Component } from 'react'
import ListingItem from './ListingItem'
import LoadingIndicator from '../../../../App/components/LoadingIndicator'
import InfiniteScroll from 'react-infinite-scroll-component'
import scrollHelper from '../../../scrollHelper'

class ListingsList extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    scrollHelper()
  }

  render() {
    const { listings, hasMore, fetchOlderExchangeListings } = this.props
    const mappedItems = listings.map((listing) => {
      return <ListingItem key={listing.id} listing={listing} />
    })
    return (
      <div 
        id="newsfeed"
        className="flex-auto relative overflow-y-hidden overflow-y-auto-m"
      >
        <InfiniteScroll
          dataLength={mappedItems.length}
          loader={<LoadingIndicator />}
          next={fetchOlderExchangeListings}
          hasMore={true}
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
