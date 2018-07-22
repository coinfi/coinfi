import React, { Component } from 'react'
import { union } from 'lodash'
import coinSearchProvider from '../../containers/coinSearch'
import Input from '../Input'
import Icon from '../Icon'

class SearchCoins extends Component {
  selectedCoins = () => {
    const { activeFilters } = this.props
    const filter = activeFilters.find((filter) => filter.get('key') === 'coins')
    if (!filter) return []
    return filter.get('value').toJS()
  }
  handleSearchInput = (value) => {
    let { searchCoins } = this.props
    // const name_not_in = this.selectedCoins()
    searchCoins(value, { limit: 10 })
  }
  selectCoin = (coin) => {
    const { setFilter, clearSearch, setActiveEntity } = this.props
    // let value = this.selectedCoins()
    // value = union(value, [coin.get('name')])
    // setFilter({ key: 'coins', value })
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
