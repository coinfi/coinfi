import React, { Component, Fragment } from 'react'
import CoinListHeader from './CoinListHeader'
import CoinListItem from './CoinListItem'
import LoadingIndicator from '../LoadingIndicator'
import watchlistStarIcon from '../../images/watch-list-star-icon.svg'
import withDevice from '~/bundles/common/utils/withDevice'

class CoinList extends Component {
  setActiveCoin = (coin) => {
    const {
      setActiveEntity,
      setFilter,
      disableUI,
      enableUI,
      isMobile,
      isDesktop,
    } = this.props
    setActiveEntity({
      type: 'coin',
      id: coin.get('id'),
      label: coin.get('name'),
    })
    const value = [coin.get('name')]
    setFilter({ key: 'coins', value })
    if (!isDesktop) disableUI('coinListDrawer')
    if (isMobile) enableUI('bodySectionDrawer', { fullScreen: true })
  }
  newCoinHandler = (coin) => {
    this.props.watchlistHandler(coin)
  }
  render() {
    const { isLoading, currentUI, isWatching } = this.props
    let { coins } = this.props
    if (currentUI('watchingOnly')) {
      coins = coins.filter((coin) => isWatching(coin.get('id')))
    }
    return (
      <Fragment>
        <CoinListHeader {...this.props} />
        <div
          className="flex-auto relative overflow-y-auto coin-watch-list"
          style={watchlistStarIcon && { textAlign: 'center' }}
        >
          {!coins.length && (
            <Fragment>
              <img className="db mt7 mb3 center" src={watchlistStarIcon} />
              <strong className="lh-copy fw3">
                Looks like you have not added <br />
                any coins to your watchlist page yet!
              </strong>
            </Fragment>
          )}

          {currentUI('coinSearch') &&
            this.props.searchedCoins.size > 0 && (
              <div className="b--b bw2">
                {this.props.searchedCoins.map((coin, key) => {
                  return (
                    <CoinListItem
                      {...{ coin, key, ...this.props }}
                      onClick={this.newCoinHandler}
                      onWatch={this.newCoinHandler}
                    />
                  )
                })}
              </div>
            )}
          {coins.map((coin, index) => {
            return (
              <CoinListItem
                key={index}
                coin={coin}
                {...this.props}
                onClick={this.newCoinHandler}
              />
            )
          })}
        </div>
      </Fragment>
    )
  }
}

export default withDevice(CoinList)
