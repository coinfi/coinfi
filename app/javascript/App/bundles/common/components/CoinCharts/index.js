import React, { Component } from 'react'
import Tabs from './Tabs'
import PriceGraph from './PriceGraph'
import TradingViewChart from './TradingViewChart'
import LoadingIndicator from '../LoadingIndicator'
import moment from 'moment'
import _ from 'lodash'
import classnames from 'classnames'
import { withCurrency } from '~/bundles/common/contexts/CurrencyContext'
import { withUserSettings } from '~/bundles/common/contexts/UserSettingsContext'
import { withStyles, createStyles } from '@material-ui/core/styles'

const STATUSES = {
  INITIALIZING: 'INITIALIZING',
  LOADING: 'LOADING',
  READY: 'READY',
}

const styles = (theme) => {
  const isDarkMode = theme.palette.type === 'dark'

  return createStyles({
    coinChartContainer: {
      marginLeft: '-1rem',
      marginRight: '-1rem',
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        marginRight: 0,
      },
    },
    tabContent: {
      '&:not(.active)': {
        position: 'fixed !important',
        clip: 'rect(1px, 1px, 1px, 1px)',
        opacity: 0,
        overflow: 'hidden',
      },
    },
  })
}

class CoinCharts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      status: STATUSES.INITIALIZING,
      processedPriceData: [],
      processedPriceDataHourly: [],
      epochPrices: [],
      tabKey: 0,
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
    const { priceData } = this.props
    const hasData = Array.isArray(priceData)

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

  handleTabChange = ({ key, label }) => {
    this.setState({
      tabKey: key,
    })
  }

  render() {
    const {
      isTradingViewVisible,
      priceData,
      priceDataHourly,
      classes,
      defaultToTradingView,
      setDefaultToTradingView,
      ...remainingProps
    } = this.props
    const { status, processedPriceData, tabKey: activeTabKey } = this.state

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
            onChange={this.handleTabChange}
            defaultToTradingView={defaultToTradingView}
            setDefaultToTradingView={setDefaultToTradingView}
            className="flex-auto justify-center justify-start-l"
          />
        )}
        <div id="coin-charts" className={classes.coinChartContainer}>
          <div
            className={classnames(classes.tabContent, {
              active: activeTabKey === 0,
            })}
          >
            <PriceGraph
              priceData={processedPriceData}
              // priceDataHourly={epochPrices}
              {...remainingProps}
            />
          </div>
          {isTradingViewVisible &&
            activeTabKey === 1 && (
              <div
                className={classnames(classes.tabContent, {
                  active: activeTabKey === 1,
                })}
              >
                <TradingViewChart
                  priceData={processedPriceData}
                  // priceDataHourly={epochPrices}
                  {...remainingProps}
                />
              </div>
            )}
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(withCurrency(withUserSettings(CoinCharts)))
