import React, { Component } from 'react'
import Input from './Input'
import Icon from './Icon'
import coinSearch from '../containers/coinSearch'
import { toggleOverlay } from '../../modules/navigation/mobile-nav'

class CoinSearch extends Component {
  handleSearchInput = value => {
    const { searchCoins, searchOpts } = this.props
    searchCoins(value, searchOpts || {})
  }
  render() {
    const { searchedCoins, searchText, clearSearch } = this.props
    return (
      <div id="global-coin-search">
        <div className="relative">
          <div className="search-input icon-input tiber">
            <Icon name="search" className="f4 reveal-m" />
            <Icon
              name="arrow-left"
              className="silver conceal-m"
              onClick={() => {
                const e = document.getElementById('global-coin-search')
                toggleOverlay(e)
                clearSearch()
              }}
            />
            <Input
              value={searchText}
              onChange={this.handleSearchInput}
              placeholder="Search"
              autoFocus
              setRef={ref => (this.inputRef = ref)}
            />
            {searchText.length > 0 && (
              <Icon
                name="times"
                className="silver conceal-m"
                onClick={() => {
                  clearSearch()
                  this.inputRef.focus()
                }}
              />
            )}
          </div>
          {searchedCoins.size > 0 && (
            <ul>
              {searchedCoins.map((coin, key) => (
                <li key={coin.get('id')}>
                  <a href={`/coins/${coin.get('slug')}`}>
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }
}

export default coinSearch(CoinSearch)
