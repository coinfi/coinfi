import React, { Component } from 'react'
import Tabs from '../Tabs'
import PriceGraph from './PriceGraph'
import TradingViewChart from './TradingViewChart'

class CoinCharts extends Component {
  render() {
    const { isTradingViewVisible } = this.props
    return (
      <div>
        {isTradingViewVisible && (
          <Tabs
            target="coin-charts"
            items={['News + Price Chart', 'TradingView Chart']}
            className="flex-auto justify-center justify-start-l"
          />
        )}

        <div id="coin-charts" className="nl3 nr3 mh0-m">
          <div className="tab-content active">
            <PriceGraph {...this.props} />
          </div>
          {isTradingViewVisible && (
            <div className="tab-content">
              <TradingViewChart {...this.props} />
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default CoinCharts
