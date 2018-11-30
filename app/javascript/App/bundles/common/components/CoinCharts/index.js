import React, { Component } from 'react'
import Tabs from './Tabs'
import PriceGraph from './PriceGraph'
import TradingViewChart from './TradingViewChart'
import LoadingIndicator from '../LoadingIndicator'
import moment from 'moment'
import * as _ from 'lodash'

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

  componentDidUpdate() {
    const { priceData, priceDataHourly } = this.props
    const hasData = Array.isArray(priceData) && Array.isArray(priceDataHourly)

    if (this.state.status === STATUSES.INITIALIZING && hasData) {
      this.setState({ status: STATUSES.LOADING }, () => {
        const hasHourlyPrice = priceDataHourly && priceDataHourly.length > 0
        const processedPriceData = Array.isArray(priceData)
          ? priceData.map(this.formatPriceDataDaily)
          : []
        const processedPriceDataHourly = hasHourlyPrice
          ? priceDataHourly.map(this.formatPriceDataHourly)
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
  }

  formatPriceDataDaily(datum) {
    return {
      ...datum,
      timestamp: moment
        .utc(datum.time)
        .startOf('day')
        .valueOf(),
    }
  }

  formatPriceDataHourly(datum) {
    return {
      ...datum,
      timestamp: moment
        .utc(datum.time)
        .startOf('hour')
        .valueOf(),
    }
  }

  render() {
    const { isTradingViewVisible } = this.props
    const { priceData, priceDataHourly, ...remainingProps } = this.props
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

export default CoinCharts
