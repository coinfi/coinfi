import React, { Component } from 'react'
import coinSearchProvider from '../../containers/coinSearch'
import Input from '../Input'
import Icon from '../Icon'
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
    const { searchText, clearSearch, searchedCoins } = this.props
    return (
      <div className="search-field">
        <div className="search-input icon-input tiber">
          <Icon
            regular
            name="search"
            className="silver"
            onClick={() => {
              this.inputRef.focus()
            }}
          />
          <Input
            value={searchText}
            onChange={this.handleSearchInput}
            placeholder="Coin/ICO Search"
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
                <button onClick={() => this.selectCoin(coin)}>
                  <div className="flex items-center">
                    {coin.get('name')}
                    <span className="b ml2 f7">{coin.get('symbol')}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
}

export default coinSearchProvider('coinFilter')(SearchCoins)
