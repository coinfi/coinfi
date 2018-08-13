import React, { Component } from 'react'
import localAPI from '../../../lib/localAPI'
import InfiniteScroll from 'react-infinite-scroll-component'

import ListingItem from './ListingItem'

class ListingsList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      listings: props.initialListings,
      detectedSince: null,
      hasMore: true,
      currentPage: 2,
    }
  }

  fetchMoreData = () => {
    localAPI
      .get(`/exchange_listings?page=${this.state.currentPage}&per=10`)
      .then((response) => {
        console.log(response)
        this.setState({
          listings: this.state.listings.concat(response.payload),
          currentPage: parseInt(this.state.currentPage, 10) + 1,
        })
        console.log(
          `the current page we are when we increment by 1: ${
            this.state.currentPage
          }`,
        )
      })
  }

  render() {
    const { listings } = this.state
    console.log(listings)
    return (
      <div className="overflow-y-hidden overflow-y-auto-m">
        <InfiniteScroll
          dataLength={this.state.listings.length}
          loader={<h4>Loading...</h4>}
          next={this.fetchMoreData}
          hasMore={this.state.hasMore}
          height={400}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>No more exchange listings present in the database.</b>
            </p>
          }
        >
          {listings.map((listing) => {
            return <ListingItem key={listing.id} listing={listing} />
          })};
        </InfiniteScroll>
      </div>
    )
  }
}

export default ListingsList
