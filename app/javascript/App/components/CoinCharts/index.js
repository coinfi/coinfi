import React, { Component } from 'react'
import Tabs from '../Tabs'
import PriceGraph from './PriceGraph'
import TradingViewChart from './TradingViewChart'

class CoinCharts extends Component {
  state = { currentSymbol: null }
  componentWillMount = () => this.updateCharts()
  componentDidUpdate = () => this.updateCharts()
  updateCharts = () => {
    const { currentSymbol } = this.state
    const { symbol } = this.props
    if (symbol !== currentSymbol) {
      this.setState({ currentSymbol: symbol })
    }
  }
  render() {
    const { currentSymbol } = this.state
    const { symbol, isTradingViewVisible } = this.props
    if (symbol !== currentSymbol) return null
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
