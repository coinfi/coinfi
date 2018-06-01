import React, { Component } from 'react'
import CoinCharts from '../CoinCharts'
import Currency from '../Currency'
import PercentageChange from '../PercentageChange'
import WatchButton from '../WatchButton'
import LoadingIndicator from '../LoadingIndicator'

export default class CoinBody extends Component {
  onWatchCoin = ({ id, watching }) => {
    const details = { id, is_being_watched: watching }
    this.props.setEntityDetails('coin', details)
  }
  render() {
    const { selectCoinDetails, activeEntity, isLoading } = this.props
    let coin = selectCoinDetails(activeEntity.id)
    if (!coin && isLoading('coin'))
      return <LoadingIndicator className="overlay bg-white-70" />
    coin = coin.toJS()
    return (
      <div className="pa4">
        <div className="flex justify-between items-center">
          <div className="f4 fw6 flex items-center">
            {coin.image_url && (
              <img className="w2e h2e mr3" src={coin.image_url} alt="" />
            )}
            {coin.name}
            <span className="ml2">({coin.symbol})</span>
          </div>
          <div>
            <WatchButton
              coinID={coin.id}
              watching={coin.is_being_watched}
              onChange={this.onWatchCoin}
            />
          </div>
        </div>
        <div className="min-h12e flex items-center justify-center">
          <div className="tc">
            <div className="flex items-center">
              <span className="f2">
                <Currency>{coin.market_info.price_usd}</Currency>
              </span>
              <span className="ml2">
                <PercentageChange
                  number={coin.market_info.percent_change_24h}
                  className="b db"
                />
              </span>
            </div>
            <div className="dib ph2 pv1 bg-light-gray f6 mt2">
              Market:&nbsp;
              {coin.market_info.market_cap_usd}
            </div>
          </div>
        </div>
        <CoinCharts
          symbol={coin.symbol}
          priceData={coin.prices_data}
          newsItems={coin.news_data}
        />
      </div>
    )
  }
}
