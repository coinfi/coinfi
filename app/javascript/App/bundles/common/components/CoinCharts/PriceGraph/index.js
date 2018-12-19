import React, { Component } from 'react'
import _ from 'lodash'
import Highcharts from 'highcharts/highstock'
import options from './options'
import chartOptions from './chartOptions'

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
    const { priceData, priceDataHourly, currency } = this.props
    const { prices: pricesDaily, volumes: volumesDaily } = this.parseData(
      priceData,
    )
    const { prices: pricesHourly, volumes: volumesHourly } = this.parseData(
      priceDataHourly,
    )

    this.Highcharts.setOptions(options)
    const chart = this.Highcharts.stockChart(
      containerID,
      chartOptions(this.Highcharts, {
        pricesHourly,
        volumesHourly,
        currency,
        setToHourly: this.setToHourly,
        setToDaily: this.setToDaily,
      }),
    )
    this.priceChart = chart
    this.setState({
      chart: chart,
      type: TYPE.hourly,
      pricesDaily,
      volumesDaily,
      pricesHourly,
      volumesHourly,
    })

    // Workaround to send a reference to the `priceChart` back up to a parent component. Ideally the
    // parent should not need reference to this `priceChart`
    if (this.props.onPriceChartCreated) {
      this.props.onPriceChartCreated(chart)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !_.isEqual(prevProps.priceData, this.props.priceData) ||
      !_.isEqual(prevProps.priceDataHourly, this.props.priceDataHourly)
    ) {
      const { priceData, priceDataHourly } = this.props
      const { prices: pricesDaily, volumes: volumesDaily } = this.parseData(
        priceData,
      )
      const { prices: pricesHourly, volumes: volumesHourly } = this.parseData(
        priceDataHourly,
      )

      this.setState(
        {
          pricesDaily,
          volumesDaily,
          pricesHourly,
          volumesHourly,
        },
        () => {
          const isDaily = this.state.type === TYPE.daily
          this.setPriceData(isDaily ? pricesDaily : pricesHourly)
          this.setVolumeData(isDaily ? volumesDaily : volumesHourly)
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
    priceData.forEach((day) => {
      let { timestamp: time, close: price, volume_from: vol } = day
      prices.push([time, price])
      volumes.push([time, vol])
    })
    return { prices, volumes }
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
    this.state.chart.series[0].setData(data)
  }

  setVolumeData = (data) => {
    this.state.chart.series[1].setData(data)
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
