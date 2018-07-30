import React, { Component } from 'react'
import SectionHeader from './SectionHeader'
import Switch from '../Switch'

class CoinListHeader extends Component {
  render() {
    const {
      toggleUI,
      currentUI,
      isWatching,
      setFilter,
      removeFilter,
      user,
    } = this.props
    let { coins } = this.props
    return (
      <SectionHeader>
        <div className="pv1">
          <div className="flex justify-center items-center">
            <Switch
              on={currentUI('watchingOnly')}
              onChange={() => {
                // TODO: Implement new onboarding signup flow.
                if (!user) return (window.location = '/login')
                toggleUI('watchingOnly')
                if (!currentUI('watchingOnly')) {
                  let value = coins
                    .filter((coin) => isWatching(coin.get('id')))
                    .map((coin) => coin.get('name'))
                  setFilter({ key: 'coins', value })
                } else {
                  removeFilter('coins')
                }
              }}
            />
            <div className="ml2 f5 silver">Watchlist</div>
          </div>
        </div>
      </SectionHeader>
    )
  }
}

export default CoinListHeader
