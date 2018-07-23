import React, { Component } from 'react'
import { union } from 'lodash'
import coinSearchProvider from '../../containers/coinSearch'
import Input from '../Input'
import Icon from '../Icon'

class SearchCoins extends Component {
  handleSearchInput = (value) => {
    let { searchCoins } = this.props
    searchCoins(value, { limit: 10 })
  }
  selectCoin = (coin) => {
    const { setFilter, clearSearch, setActiveEntity } = this.props
    window.location = `/coins/${coin.get('name').toLowerCase()}`
    clearSearch()
  }
  render() {
    const {
      searchText,
      clearSearch,
      searchedCoins,
      isWatching,
      updateUser,
      user,
      onWatch,
      searchCoins,
    } = this.props

    return (
      <div className="search-field">
        <div className="flex items-center f5 tiber">
          <Icon
            regular
            name="search"
            className="silver mr1"
            onClick={() => {
              this.inputRef.focus()
            }}
          />
          <Input
            value={searchText}
            onChange={this.handleSearchInput}
            placeholder="Search Coins/ICOs"
            setRef={(ref) => (this.inputRef = ref)}
            className="unstyled"
          />
          {searchText.length > 0 && (
            <Icon
              regular
              name="times"
              className="silver"
              onClick={() => {
                clearSearch()
                this.inputRef.focus()
              }}
            />
          )}
        </div>
        {searchedCoins.size > 0 && (
          <ul>
            {searchedCoins.map((coin) => (
              <li key={coin.get('id')}>
                <a onClick={() => this.selectCoin(coin)}>
                  <div className="flex items-center">
                    {coin.get('name')} ({coin.get('symbol')})
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
}

export default coinSearchProvider('coinFilter')(SearchCoins)
