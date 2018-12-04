import React, { Component } from 'react'
import Tabs from './Tabs'
import PriceGraph from './PriceGraph'
import TradingViewChart from './TradingViewChart'
import moment from 'moment'
import * as _ from 'lodash'
import CurrencyContext from '~/bundles/common/contexts/CurrencyContext'

class CoinCharts extends Component {
  constructor(props) {
    super(props)

    const newData = this.processData(props)

    this.state = {
      ...newData,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { currencyRate } = this.props

    if (prevProps.currencyRate !== currencyRate) {
      const newData = this.processData(this.props)

      this.setState({
        ...newData,
      })
    }
  }

  processData(props) {
    const { priceData, priceDataHourly, currency, currencyRate } = props

    const hasHourlyPrice = priceDataHourly && priceDataHourly.length > 0
    const processedPriceData = Array.isArray(priceData)
      ? priceData.map((datum) =>
          this.formatPriceDataDaily(datum, currencyRate, currency),
        )
      : []
    const processedPriceDataHourly = hasHourlyPrice
      ? priceDataHourly.map((datum) =>
          this.formatPriceDataHourly(datum, currencyRate, currency),
        )
      : [...processedPriceData]

    const sortedPriceData = [
      ...(hasHourlyPrice ? processedPriceDataHourly : []),
      ...processedPriceData,
    ].sort((a, b) => a.timestamp - b.timestamp)
    const epochPrices = _.sortedUniqBy(
      sortedPriceData,
      (datum) => datum.timestamp,
    )

    return {
      processedPriceData,
      processedPriceDataHourly,
      epochPrices,
    }
  }

  formatPriceDataDaily(datum, currencyRate = 1, currency = 'USD') {
    const {
      open,
      close,
      high,
      low,
      volume_to,
      to_currency,
      ...remainingData
    } = datum

    return {
      ...remainingData,
      to_currency: currency,
      open: open * currencyRate,
      close: close * currencyRate,
      high: high * currencyRate,
      low: low * currencyRate,
      volume_to: volume_to * currencyRate,
      timestamp: moment
        .utc(datum.time)
        .startOf('day')
        .valueOf(),
    }
  }

  formatPriceDataHourly(datum, currencyRate = 1, currency = 'USD') {
    const { open, close, high, low, volume_to, ...remainingData } = datum

    return {
      ...remainingData,
      to_currency: currency,
      open: open * currencyRate,
      close: close * currencyRate,
      high: high * currencyRate,
      low: low * currencyRate,
      volume_to: volume_to * currencyRate,
      timestamp: moment
        .utc(datum.time)
        .startOf('hour')
        .valueOf(),
    }
  }

  render() {
    const { isTradingViewVisible } = this.props
    const { annotations, currency } = this.props
    const {
      processedPriceData,
      processedPriceDataHourly,
      epochPrices,
    } = this.state

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
              annotations={annotations}
              currency={currency}
            />
          </div>
          {isTradingViewVisible && (
            <div className="tab-content">
              <TradingViewChart
                priceData={processedPriceData}
                priceDataHourly={epochPrices}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default (props) => (
  <CurrencyContext.Consumer>
    {(payload) => <CoinCharts {...props} {...payload} />}
  </CurrencyContext.Consumer>
)
