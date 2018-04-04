import React, { Component } from 'react'
import WatchButton from './WatchButton'

export default class WatchlistSearch extends Component {
  handleSearchInput = ({ target: { value } }) => {
    this.props.searchCoins(value)
  }
  render() {
    const { searchedCoins, addCoinSuccess, searchText } = this.props
    return (
      <div>
        <div className="bg-white">
          <div className="pa3">
            <input
              type="text"
              value={searchText}
              onChange={this.handleSearchInput}
              className="input-alt tc"
              placeholder="Search"
            />
          </div>
        </div>
        {searchedCoins.size > 0 && (
          <div>
            {searchedCoins.map(coin => (
              <div key={coin.get('id')} className="pb3 mb3 bb b--athens-dark">
                {coin.get('name')}
                <WatchButton
                  coinID={coin.get('id')}
                  noFetch
                  onSuccess={addCoinSuccess}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}
