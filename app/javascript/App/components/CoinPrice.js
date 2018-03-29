import React, { Component } from 'react'
import API from '../utils/API'

// Not yet in use

export default class CoinPrice extends Component {
  state = { price: 0 }
  fetchPrice = () => {
    const { symbol } = this.props
    API.get(`api/v1/coins/${symbol}.json`).then(({ price }) => {
      this.setState({ price })
    })
  }
  render() {
    const { symbol } = this.props
    const { price } = this.state
    return (
      <div>
        {symbol} {price}
      </div>
    )
  }
}
