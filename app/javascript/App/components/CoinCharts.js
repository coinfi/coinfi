import React, { Component } from 'react'
import container from '../containers/coinCharts'
import Tabs from './Tabs'

class CoinCharts extends Component {
  render() {
    return (
      <div>
        <div id="highcharts" />
        <div id="tradingview" />
      </div>
    )
  }
}

export default container(CoinCharts)
