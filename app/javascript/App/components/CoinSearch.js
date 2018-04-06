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
          className="tr"
          placeholder="Search"
          autoFocus
        />
        {searchedCoins.size > 0 && (
          <div id="coin-search-results" className="tr">
            {searchedCoins.map((coin, key) => (
              <a
                href={`/coins/${coin.get('slug')}`}
                key={coin.get('id')}
                className="db pa2 bb b--light-gray"
              >
                <div className="flex items-center justify-end">
                  <span className="b mr2 f7">{coin.get('symbol')}</span>
                  {coin.get('name')}
                  {coin.get('image_url') && (
                    <img
                      className="w2e h2e ml3"
                      src={coin.get('image_url')}
                      alt=""
                    />
                  )}
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
