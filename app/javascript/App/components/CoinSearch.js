import React, { Component } from 'react'
import Input from './Input'
import CoinSearchContainer from '../containers/CoinSearchContainer'

class CoinSearch extends Component {
  handleSearchInput = ({ target: { value } }) => {
    let { searchOpts } = this.props
    searchOpts = searchOpts || {}
    this.props.searchCoins(value, searchOpts)
  }
  render() {
    const { searchedCoins, searchText } = this.props
    return (
      <div>
        <Input
          value={searchText}
          onChange={this.handleSearchInput}
          placeholder="Search"
          autoFocus
        />
        {searchedCoins.size > 0 && (
          <div id="coin-search-results">
            {searchedCoins.map((coin, key) => (
              <a
                href={`/coins/${coin.get('slug')}`}
                key={coin.get('id')}
                className="db pa2 bb b--light-gray"
              >
                <div className="flex items-center">
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
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default CoinSearchContainer(CoinSearch)
