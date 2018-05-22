import React, { Component } from 'react'
import CoinCharts from '../CoinCharts'
export default class CoinBody extends Component {
  state = { fetchedID: null }
  componentWillMount = () => this.fetchCoinDetails()
  componentDidUpdate = () => this.fetchCoinDetails()
  fetchCoinDetails() {
    const {
      currentItem: { id },
      fetchEntityDetails
    } = this.props
    const { fetchedID } = this.state
    if (fetchedID !== id) {
      fetchEntityDetails('coin', id)
      this.setState({ fetchedID: id })
      this.forceUpdate()
    }
  }
  render() {
    const { selectCoinDetails, currentItem } = this.props
    const coin = selectCoinDetails(currentItem.id)
    if (!coin) return null
    return (
      <div className="pa4">
        <div className="flex justify-between">
          <div>{coin.get('name')}</div>
          <div>Watch</div>
        </div>
        <CoinCharts
          symbol={coin.get('symbol')}
          priceData={coin.get('prices_data').toJS()}
          articles={coin.get('news_data').toJS()}
        />
      </div>
    )
  }
}
