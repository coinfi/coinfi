import React, { Component } from 'react'
import CoinCharts from '../CoinCharts'
import Currency from '../Currency'
import PercentageChange from '../PercentageChange'
import WatchButton from '../WatchButton'

export default class CoinBody extends Component {
  state = { fetchedID: null }
  componentWillMount = () => this.fetchCoinDetails()
  componentDidUpdate = () => this.fetchCoinDetails()
  fetchCoinDetails() {
    const { currentItem, fetchEntityDetails } = this.props
    const { id } = currentItem
    const { fetchedID } = this.state
    if (fetchedID !== id) {
      fetchEntityDetails('coin', id)
      this.setState({ fetchedID: id })
      this.forceUpdate()
    }
  }
  render() {
    const { selectCoinDetails, currentItem } = this.props
    const { fetchedID } = this.state
    if (fetchedID !== currentItem.id) return null
    let coin = selectCoinDetails(currentItem.id)
    if (!coin) return null
    coin = coin.toJS()
    return (
      <div className="pa4">
        <div className="flex justify-between">
          <div className="f4 fw6 flex items-center">
            {coin.image_url && (
              <img className="w2e h2e mr3" src={coin.image_url} alt="" />
            )}
            {coin.name}
            <span className="ml2">({coin.symbol})</span>
          </div>
          <div>
            <WatchButton coinID={coin.id} watching={coin.is_being_watched} />
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
            <div className="dib ph2 pv1 bg-light-gray f6">
              Market:&nbsp;
              {coin.market_info.market_cap_usd}
            </div>
          </div>
        </div>
        <CoinCharts
          symbol={coin.symbol}
          priceData={coin.prices_data}
          articles={coin.news_data}
        />
      </div>
    )
  }
}
