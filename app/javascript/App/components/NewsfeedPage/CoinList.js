import React, { Component, Fragment } from 'react'
import CoinListHeader from './CoinListHeader'
import CoinListItem from './CoinListItem'
import LoadingIndicator from '../LoadingIndicator'
import coinSearchProvider from '../../containers/coinSearch'
import watchlistStarIcon from '../../images/watch-list-star-icon.svg'

class CoinList extends Component {
  setActiveCoin = (coin) => {
    const { setActiveEntity, setFilter, disableUI, enableUI } = this.props
    setActiveEntity({
      type: 'coin',
      id: coin.get('id'),
      label: coin.get('name')
    })
    const value = [coin.get('name')]
    setFilter({ key: 'coins', value })
    if (!window.isDesktop) disableUI('coinListDrawer')
    if (window.isMobile) enableUI('bodySectionDrawer', { fullScreen: true })
  }
  newCoinHandler = (coin) => {
    this.setActiveCoin(coin)
    this.props.toggleUI('coinSearch')
    this.props.clearSearch()
  }
  render() {
    const { isLoading, currentUI, isWatching, searchedCoins } = this.props
    let { coins } = this.props
    if (currentUI('watchingOnly')) {
      coins = coins.filter((coin) => isWatching(coin.get('id')))
    }
    return (
      <Fragment>
        <CoinListHeader {...this.props} />
        <div className="flex-auto relative overflow-y-auto coin-watch-list" style={watchlistStarIcon && {textAlign:'center'}} >

          { !coins.length && (
            <Fragment>
              <img style={{margin:'auto', marginTop: 60, marginBottom:20, display:'block'}} src={watchlistStarIcon} />
              <strong style={{lineHeight:'1.5rem', color: 'rgba(0, 0, 0, 0.54)', fontSize:14}}>looks like you have not added <br />any coins to your watchlist page yet</strong>
            </Fragment>
            )
          }

          {isLoading('coins') && (
            <LoadingIndicator className="overlay bg-white-70" />
          )}
          {currentUI('coinSearch') &&
            searchedCoins.size > 0 && (
              <div className="b--b bw2">
                {searchedCoins.map((coin, key) => {
                  return (
                    <CoinListItem
                      {...{ coin, key, ...this.props }}
                      onClick={this.newCoinHandler}
                      onWatch={this.newCoinHandler}
                    />
                  )}
                )}
              </div>
            )}
            {coins.map((coin, index) => {
              return (
                <CoinListItem
                  key={index}
                  coin={coin}
                  {...this.props}
                  onClick={this.setActiveCoin}
                />
              )}
            )}
        </div>
      </Fragment>
    )
  }
}

export default coinSearchProvider('coinList')(CoinList)
