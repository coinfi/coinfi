import React, { Component } from 'react'
import ListingItem from './ListingItem'

const updateResults = (result) => (prevState) => ({
  results: [...prevState.results, result]
})

class ListingsList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      results: [],
      detectedSince: null,
    }
  }

  onComponentMount() {
    this.fetchListings()
  }

  fetchListings = () =>
    fetch("http://localhost:3000/api/exchange_listings.json")
      .then((response) => response.json())
      .then((result) => this.onSetResult(result))

  onSetResult = (result) =>
    this.setState(updateResults(result))

  render() {
    const { results } = this.state
    return (
      <div>
        {results.map((listing) => {
          return (
            <ListingItem
              key={listing.id}
              listing={listing}
            />
          )
        })}
      </div>
    )
  }
}

export default ListingsList
