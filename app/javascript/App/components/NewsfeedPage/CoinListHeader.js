import React, { Component } from 'react'
import SectionHeader from './SectionHeader'
import Switch from '../Switch'
import Icon from '../Icon'
import Input from '../Input'

class CoinListHeader extends Component {
  onSearchInput = (value) => {
    let { searchCoins, coinIDs } = this.props
    searchCoins(value, { q: { id_not_in: coinIDs }, limit: 4 })
  }
  render() {
    const { toggleUI, currentUI, searchText, isWatching, setFilter, removeFilter, user } = this.props
    let { coins } = this.props
    return (
      <SectionHeader>
        <div className="pv1">
          {currentUI('coinSearch') ? (
            <Input
              value={searchText}
              onChange={this.onSearchInput}
              placeholder="Search"
              autoFocus
              setRef={(ref) => (this.inputRef = ref)}
              className="unstyled"
            />
          ) : (
            <div className="flex items-center">
              <Switch
                on={currentUI('watchingOnly')}
                onChange={() => {
                  // TODO: Implement new onboarding signup flow.
                  if (!user) return (window.location = '/login')
                  toggleUI('watchingOnly')
                  if (!currentUI('watchingOnly')) {
                    let value = coins.filter((coin) => isWatching(coin.get('id'))).map((coin) => coin.get('name'))
                    setFilter({ key: 'coins', value })
                  } else {
                    removeFilter('coins')
                  }
                }}
              />
              <span className="ml2 f6 silver">Watchlist</span>
            </div>
          )}
        </div>
        <div className="pv1">
          {currentUI('coinSearch') ? (
            <Icon onClick={() => toggleUI('coinSearch')} name="times" regular />
          ) : (
            <span className="tooltipped">
              <Icon
                onClick={() => toggleUI('coinSearch')}
                name="plus"
                regular
              />
              <span className="tooltip">Add a coin</span>
            </span>
          )}
        </div>
      </SectionHeader>
    )
  }
}

export default CoinListHeader
