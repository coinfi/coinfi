import React, { Component } from 'react'
import WatchButton from './WatchButton'
import Input from './Input'
import CoinSearchContainer from '../containers/CoinSearchContainer'

class WatchlistSearch extends Component {
  handleSearchInput = ({ target: { value } }) => {
    let { searchOpts } = this.props
    searchOpts = searchOpts || {}
    this.props.searchCoins(value, searchOpts)
  }
  render() {
    const { searchedCoins, addCoinSuccess, searchText } = this.props
    return (
      <div>
        <Input
          value={searchText}
          onChange={this.handleSearchInput}
          className="input-alt"
          placeholder="Search"
        />
        {searchedCoins.size > 0 && (
          <div>
            {searchedCoins.map(coin => (
              <div
                key={coin.get('id')}
                className="pb3 mt3 bb b--athens-dark flex"
              >
                <div className="flex-auto flex items-center">
                  {coin.get('image_url') && (
                    <img
                      className="w2e h2e mr3"
                      src={coin.get('image_url')}
                      alt=""
                    />
                  )}
                  {coin.get('name')}
                  <span className="b ml2 f7">{coin.get('symbol')}</span>
                </div>
                <WatchButton
                  coinID={coin.get('id')}
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

export default CoinSearchContainer(WatchlistSearch)
