import React, { Component } from 'react'
import ListingItem from './ListingItem'

class ListingsList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      listings: props.initialListings,
      detectedSince: null,
    }
  }

  onComponentMount() {
    this.fetchListings()
  }

  onSetResult = (result) => {
    console.log(result)
    this.setState({
      listings: result,
    })
  }

  render() {
    const { listings } = this.state
    console.log(listings)
    return (
      <div>
        {listings ? (
          listings.map((listing) => {
            return <ListingItem key={listing.id} listing={listing} />
          })
        ) : (
          <div>Loading...</div>
        )}
      </div>
    )
  }
}

export default ListingsList
