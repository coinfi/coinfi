import React, { Component } from 'react'
import WatchButton from './WatchButton'

export default class WatchlistSearch extends Component {
  handleSearchInput = ({ target: { value } }) => {
    this.props.searchCoins(value)
  }
  render() {
    const { searchedCoins, addCoinSuccess, searchText } = this.props
    return (
      <div className="bg-white pa3">
        <input
          type="text"
          value={searchText}
          onChange={this.handleSearchInput}
          className="input-alt tc"
          placeholder="Search"
        />
        {searchedCoins.size > 0 && (
          <div className="mt3">
            {searchedCoins.map(coin => (
              <div
                key={coin.get('id')}
                className="pb3 mb3 bb b--athens-dark flex justify-between"
              >
                <div>
                  {coin.get('name')}
                  <span className="b ml2 f7">{coin.get('symbol')}</span>
                </div>
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
