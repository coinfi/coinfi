import React, { Component } from 'react'
import coinSearchProvider from '../../containers/coinSearch'
import Input from '../Input'
import Icon from '../Icon'
import WatchButton from './WatchButton'
import { union } from 'lodash'

class SearchCoins extends Component {
  selectedCoins = () => {
    const { activeFilters } = this.props
    const filter = activeFilters.find((filter) => filter.get('key') === 'coins')
    if (!filter) return []
    return filter.get('value').toJS()
  }
  handleSearchInput = (value) => {
    let { searchCoins } = this.props
    const name_not_in = this.selectedCoins()
    searchCoins(value, { q: { name_not_in }, limit: 10 })
  }
  selectCoin = (coin) => {
    const { setFilter, clearSearch, setActiveEntity } = this.props
    setActiveEntity({ type: 'coin', id: coin.get('id') })
    let value = this.selectedCoins()
    value = union(value, [coin.get('name')])
    setFilter({ key: 'coins', value })
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
    } = this.props
    debugger
    return (
      <div className="search-field">
        <div className="flex items-center ph2 f5 tiber">
          <Icon
            regular
            name="search"
            className="silver mr1"
            onClick={() => { this.inputRef.focus() }}
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
                <div className="watch-btn">
                  <WatchButton
                    isWatching={isWatching}
                    coin={coin}
                    updateUser={updateUser}
                    user={user}
                    onWatch={onWatch}
                    hasText
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
}

export default coinSearchProvider('coinFilter')(SearchCoins)
