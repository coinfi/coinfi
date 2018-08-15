import React, { Component, Fragment } from 'react'
import CustomScroll from 'react-custom-scroll'
import CoinListHeader from './CoinListHeader'
import CoinListItem from './CoinListItem'
import LoadingIndicator from '../LoadingIndicator'
import watchlistStarIcon from '../../images/watch-list-star-icon.svg'
import scrollHelper from './../../scrollHelper'

class CoinList extends Component {
  setActiveCoin = (coin) => {
    const { setActiveEntity, setFilter, disableUI, enableUI } = this.props
    setActiveEntity({
      type: 'coin',
      id: coin.get('id'),
      label: coin.get('name'),
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

  componentDidMount() {
    // set max height to enable scroll in ff
    scrollHelper()
  }

  render() {
    const { isLoading, currentUI, isWatching } = this.props
    let { coins } = this.props
    if (currentUI('watchingOnly')) {
      coins = coins.filter((coin) => isWatching(coin.get('id')))
    }
    return (
      <div style={{height:780}}>
        <CoinListHeader {...this.props} />
        <div className="coin-list-drawer" style={{ flex: 1, minHeight: 0, minWidth: 0, height:'90%', overflowY:'scroll' }}>
          {/* <CustomScroll flex='1'> */}
          {!coins.length &&
            !isLoading('coins') && (
              <Fragment>
                <img className="db mt7 mb3 center" src={watchlistStarIcon} />
                <strong className="lh-copy fw3">
                  Looks like you have not added <br />
                  any coins to your watchlist page yet!
                </strong>
              </Fragment>
            )}

          {isLoading('coins') && (
            <LoadingIndicator className="overlay bg-white-70" />
          )}
            {coins.map((coin, index) => {
              return (
                <CoinListItem
                  key={index}
                  coin={coin}
                  {...this.props}
                  onClick={this.setActiveCoin}
                />
              )
            })}
        </div>
          {/* </CustomScroll> */}
      </div>
    )
  }
}

export default CoinList
