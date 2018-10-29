import React, { Component } from 'react'
import Tabs from './Tabs'
import PriceGraph from './PriceGraph'
import TradingViewChart from './TradingViewChart'
import moment from 'moment'
import * as _ from 'lodash'

class CoinCharts extends Component {
  formatPriceData(datum) {
    return {
      ...datum,
      timestamp: moment.utc(datum.time).valueOf(),
    }
  }

  render() {
    const { isTradingViewVisible } = this.props
    const { priceData, priceDataHourly, ...remainingProps } = this.props

    const hasHourlyPrice = priceDataHourly && priceDataHourly.length > 0
    const processedPriceData = priceData.map(this.formatPriceData)
    const processedPriceDataHourly = hasHourlyPrice
      ? priceDataHourly.map(this.formatPriceData)
      : processedPriceData

    const sortedPriceData = [
      ...(hasHourlyPrice ? processedPriceDataHourly : []),
      ...processedPriceData,
    ].sort((a, b) => a.timestamp - b.timestamp)
    const epochPrices = _.sortedUniqBy(
      sortedPriceData,
      (datum) => datum.timestamp,
    )

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
            <PriceGraph
              priceData={processedPriceData}
              priceDataHourly={epochPrices}
              {...remainingProps}
            />
          </div>
          {isTradingViewVisible && (
            <div className="tab-content">
              <TradingViewChart
                priceData={processedPriceData}
                priceDataHourly={epochPrices}
                {...remainingProps}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default CoinCharts
