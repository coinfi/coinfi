import React, { Component } from 'react'
import container from '../containers/coinCharts'
import Tabs from './Tabs'

const tab1 = 'Graph'
const tab2 = 'Candlestick'
class CoinCharts extends Component {
  handleChange = ({ label }) => {
    if (label === tab2) this.props.renderTradingview()
  }
  render() {
    return (
      <div>
        <Tabs
          target="coin-charts"
          items={[tab1, tab2]}
          onChange={this.handleChange}
        />
        <div id="coin-charts">
          <div id="highcharts" className="tab-content active" />
          <div id="tradingview" className="tab-content" />
        </div>
      </div>
    )
  }
}

export default container(CoinCharts)
