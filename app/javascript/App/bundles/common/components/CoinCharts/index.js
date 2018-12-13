import React, { Component } from 'react'
import Tabs from './Tabs'
import PriceGraph from './PriceGraph'
import TradingViewChart from './TradingViewChart'
import LoadingIndicator from '../LoadingIndicator'
import moment from 'moment'
import * as _ from 'lodash'
import CurrencyContext from '~/bundles/common/contexts/CurrencyContext'

const STATUSES = {
  INITIALIZING: 'INITIALIZING',
  LOADING: 'LOADING',
  READY: 'READY',
}

class CoinCharts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      status: STATUSES.INITIALIZING,
      processedPriceData: [],
      processedPriceDataHourly: [],
      epochPrices: [],
    }
  }

  componentDidMount() {
    if (this.state.status === STATUSES.INITIALIZING && this.hasData()) {
      this.processData()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.status === STATUSES.INITIALIZING && this.hasData()) {
      this.processData()
    } else if (
      this.state.status === STATUSES.READY &&
      prevProps.currencyRate !== this.props.currencyRate
    ) {
      this.processData()
    }
  }

  processData() {
    const { priceData, priceDataHourly, currency, currencyRate } = this.props

    this.setState({ status: STATUSES.LOADING }, () => {
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

      this.setState({
        status: STATUSES.READY,
        processedPriceData,
        processedPriceDataHourly,
        epochPrices,
      })
    })
  }

  hasData() {
    const { priceData, priceDataHourly } = this.props
    const hasData = Array.isArray(priceData) && Array.isArray(priceDataHourly)

    return hasData
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
    const {
      isTradingViewVisible,
      priceData,
      priceDataHourly,
      ...remainingProps
    } = this.props
    const { status, processedPriceData, epochPrices } = this.state

    if (status !== STATUSES.READY) {
      return (
        <div>
          <LoadingIndicator />
        </div>
      )
    }

    return (
      <div>
        {isTradingViewVisible && (
          <Tabs
            target="coin-charts"
            items={['Line Chart', 'TradingView Chart']}
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

export default (props) => (
  <CurrencyContext.Consumer>
    {(payload) => <CoinCharts {...props} {...payload} />}
  </CurrencyContext.Consumer>
)
