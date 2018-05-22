import React, { Component } from 'react'

export default class CoinBody extends Component {
  componentWillMount() {
    const { currentItem, fetchEntityDetails } = this.props
    fetchEntityDetails('coin', currentItem.id)
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
      </div>
    )
  }
}
