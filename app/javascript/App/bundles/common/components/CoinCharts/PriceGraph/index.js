import React, { Component } from 'react'
import _ from 'lodash'
import moment from 'moment'
import Highcharts from 'highcharts/highstock'
import options from './options'
import chartOptions from './chartOptions'
import { formatAbbreviatedPrice } from '~/bundles/common/utils/numberFormatters'

const containerID = 'highcharts'

const TYPE = {
  hourly: 'hourly',
  daily: 'daily',
}

class PriceGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chart: null,
    }
    this.Highcharts = Highcharts
  }

  componentDidMount() {
    const { priceData, priceDataHourly, annotations, currency } = this.props
    const { prices: pricesDaily, volumes: volumesDaily } = this.parseData(
      priceData,
    )
    const { prices: pricesHourly, volumes: volumesHourly } = this.parseData(
      priceDataHourly,
    )
    const annotationData = this.parseAnnotationData(annotations, pricesDaily)

    const hasHourlyData = _.isArray(priceDataHourly)

    this.Highcharts.setOptions(options)
    const chart = this.Highcharts.stockChart(
      containerID,
      chartOptions(this.Highcharts, {
        pricesDaily,
        volumesDaily,
        pricesHourly,
        volumesHourly,
        annotationData,
        currency,
        setToHourly: hasHourlyData ? this.setToHourly : () => {},
        setToDaily: this.setToDaily,
      }),
    )
    this.priceChart = chart
    this.setState({
      chart: chart,
      type: TYPE.daily,
      pricesDaily,
      volumesDaily,
      pricesHourly,
      volumesHourly,
      annotationData,
    })

    // Workaround to send a reference to the `priceChart` back up to a parent component. Ideally the
    // parent should not need reference to this `priceChart`
    if (this.props.onPriceChartCreated) {
      this.props.onPriceChartCreated(chart)
    }
  }

  componentDidUpdate(prevProps) {
    const dailyDataChanged = !_.isEqual(
      prevProps.priceData,
      this.props.priceData,
    )
    const hourlyDataChanged = !_.isEqual(
      prevProps.priceDataHourly,
      this.props.priceDataHourly,
    )
    const annotationDataChanged = !_.isEqual(
      prevProps.annotations,
      this.props.annotations,
    )

    if (dailyDataChanged || hourlyDataChanged || annotationDataChanged) {
      const { priceData, priceDataHourly, annotations } = this.props

      if (dailyDataChanged) {
        var { prices: pricesDaily, volumes: volumesDaily } = this.parseData(
          priceData,
        )
      } else {
        var { pricesDaily } = this.state
      }

      if (hourlyDataChanged) {
        var { prices: pricesHourly, volumes: volumesHourly } = this.parseData(
          priceDataHourly,
        )
      }

      const annotationData = this.parseAnnotationData(annotations, pricesDaily)

      this.setState(
        {
          ...(dailyDataChanged && {
            pricesDaily,
            volumesDaily,
          }),
          ...(hourlyDataChanged && {
            pricesHourly,
            volumesHourly,
          }),
          annotationData,
        },
        () => {
          if (dailyDataChanged && this.state.type === TYPE.daily) {
            this.setPriceData(pricesDaily)
            this.setVolumeData(volumesDaily)
          } else if (hourlyDataChanged && this.state.type !== TYPE.daily) {
            this.setPriceData(pricesHourly)
            this.setVolumeData(volumesHourly)
          }
        },
      )
    }

    if (prevProps.currency !== this.props.currency) {
      this.setCurrency(this.props.currency)
    }
  }

  parseData = (priceData) => {
    const prices = []
    const volumes = []
    if (_.isArray(priceData)) {
      priceData.forEach((day) => {
        let { timestamp: time, close: price, volume_to: vol } = day
        prices.push([time, price])
        volumes.push([time, vol])
      })
    }
    return { prices, volumes }
  }

  /*
  * Try to set annotations to match with pricing data.
  * This done by trying to set annotation data to have x,y coordinates
  *   corresponding to existing price data.
  * prices data is an array of arrays of format [time, price], i.e., [x, y]
  */
  parseAnnotationData = (annotations, prices) => {
    if (!_.isArray(annotations)) return undefined

    const { currency, currencySymbol, currencyRate, coinObj } = this.props
    const { symbol, price } = coinObj

    return annotations.reduce((series, datum) => {
      // align time to start of day
      const { to_address_name, value, timestamp } = datum
      const baseX = moment
        .utc(timestamp)
        .startOf('day')
        .valueOf()

      // search for nearest available day with price going forward
      let x = baseX
      let foundPrice
      for (let i = 1; i < 6; i++) {
        foundPrice = _.find(prices, (price) => price[0] == x)
        if (!foundPrice) {
          x = moment
            .utc(timestamp)
            .startOf('day')
            .add(i, 'days')
            .valueOf()
        } else {
          break
        }
      }

      if (!foundPrice) {
        return series
      }

      const formattedPrice = formatAbbreviatedPrice(
        value * price * currencyRate,
      )
      const tokens = formatAbbreviatedPrice(value)
      const text = `${tokens} ${symbol} (${currencySymbol}${formattedPrice} ${currency}) moved into ${to_address_name}`

      return [
        ...series,
        {
          ...datum,
          text,
          x: foundPrice ? x : baseX,
          y: foundPrice ? foundPrice[1] : 0,
        },
      ]
    }, [])
  }

  setToHourly = () => {
    const { pricesHourly, volumesHourly } = this.state
    this.setPriceData(pricesHourly)
    this.setVolumeData(volumesHourly)
    this.setState({
      type: TYPE.hourly,
    })
  }

  setToDaily = () => {
    const { pricesDaily, volumesDaily } = this.state
    this.setPriceData(pricesDaily)
    this.setVolumeData(volumesDaily)
    this.setState({
      type: TYPE.daily,
    })
  }

  setCurrency = (currency) => {
    const priceLabel = `${currency} Price`
    const volumeLabel = `${currency} Volume`
    try {
      this.state.chart.series[0].name = priceLabel
      this.state.chart.yAxis[0].setTitle({
        text: priceLabel,
      })
      this.state.chart.series[1].name = volumeLabel
      this.state.chart.yAxis[1].setTitle({
        text: volumeLabel,
      })
    } catch (e) {
      console.error(e)
    }
  }

  setPriceData = (data) => {
    if (_.get(this.state.chart, ['series', 0])) {
      this.state.chart.series[0].setData(data)
    }
  }

  setVolumeData = (data) => {
    if (_.get(this.state.chart, ['series', 1])) {
      this.state.chart.series[1].setData(data)
    }
  }

  setAnnotationData = (data) => {
    if (_.get(this.state.chart, ['series', 2])) {
      this.state.chart.series[2].setData(data)
    }
  }

  render() {
    return (
      <div>
        <div id={containerID} />
      </div>
    )
  }
}

export default PriceGraph
