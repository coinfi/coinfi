import React, { Component } from 'react'
import _ from 'lodash'
import Highcharts from 'highcharts/highstock'
import options from './options'
import chartOptions from './chartOptions'
import { withThemeType } from '../../../contexts/ThemeContext'
import {
  darkPineGreen,
  white,
  white12,
  white70,
  skyBlue,
} from '../../../styles/colors'

const containerID = 'highcharts'
const PRICE_INDEX = 0
const VOLUME_INDEX = 1

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
    const { priceData, priceDataHourly, currency, isDarkMode } = this.props
    const { prices: pricesDaily, volumes: volumesDaily } = this.parseData(
      priceData,
    )
    const { prices: pricesHourly, volumes: volumesHourly } = this.parseData(
      priceDataHourly,
    )

    const hasHourlyData = _.isArray(priceDataHourly)

    this.Highcharts.setOptions(options)
    const chart = this.Highcharts.stockChart(
      containerID,
      chartOptions(this.Highcharts, {
        pricesDaily,
        volumesDaily,
        pricesHourly,
        volumesHourly,
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
    })

    this.setTheme(isDarkMode)

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

    if (prevProps.isDarkMode !== this.props.isDarkMode) {
      this.setTheme(this.props.isDarkMode)
    }
  }

  parseData = (priceData) => {
    const prices = []
    const volumes = []
    if (_.isArray(priceData)) {
      priceData.forEach((day) => {
        let { timestamp: time, close: price, volume_to: vol } = day
        prices.push({ x: time, y: price })
        volumes.push({ x: time, y: vol })
      })
    }
    return { prices, volumes }
  }

  setToHourly = () => {
    const { pricesHourly, volumesHourly, type } = this.state
    if (type === TYPE.hourly) return

    this.setPriceData(pricesHourly)
    this.setVolumeData(volumesHourly)
    this.setState({
      type: TYPE.hourly,
    })
  }

  setToDaily = () => {
    const { pricesDaily, volumesDaily, type } = this.state
    if (type === TYPE.daily) return

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
      this.priceChart.series[PRICE_INDEX].name = priceLabel
      this.priceChart.yAxis[PRICE_INDEX].setTitle({
        text: priceLabel,
      })
      this.priceChart.series[VOLUME_INDEX].name = volumeLabel
      this.priceChart.yAxis[VOLUME_INDEX].setTitle({
        text: volumeLabel,
      })
    } catch (e) {
      console.error(e)
    }
  }

  setTheme = (isDarkMode) => {
    try {
      // TODO: setting rangeSelector styles clears out the text
      const chart = this.priceChart
      const volumeSeries = this.priceChart.series[VOLUME_INDEX]
      if (isDarkMode) {
        const axisColors = {
          lineColor: white12,
          gridLineColor: white12,
          minorGridLineColor: white12,
          tickColor: white12,
        }
        const textStyles = {
          style: {
            color: white70,
          },
        }
        chart.update(
          {
            chart: {
              style: {
                color: white70,
              },
              backgroundColor: darkPineGreen,
            },
            rangeSelector: {
              inputBoxBorderColor: white12, // #cccccc
              inputStyle: {
                color: white70, // #444444
              },
              labelStyle: {
                color: white, // #666666
              },
            },
            xAxis: {
              ...axisColors,
              labels: { ...textStyles },
              title: { ...textStyles },
            },
            yAxis: [
              {
                ...axisColors,
                labels: { ...textStyles },
                title: { ...textStyles },
              },
              {
                ...axisColors,
                labels: { ...textStyles },
                title: { ...textStyles },
              },
            ],
          },
          false,
        )
        volumeSeries.update(
          {
            color: skyBlue,
          },
          false,
        )
      } else {
        const gridColor = '#F3F3F3'
        const textColor = '#66666'
        const axisColors = {
          lineColor: gridColor,
          gridLineColor: gridColor,
          minorGridLineColor: gridColor,
          tickColor: gridColor,
        }
        const textStyles = {
          style: {
            color: textColor,
          },
        }
        chart.update(
          {
            chart: {
              color: '#C0C0C0',
              backgroundColor: white,
            },
            rangeSelector: {
              inputBoxBorderColor: '#cccccc',
              inputStyle: {
                color: '#444444',
              },
              labelStyle: {
                color: textColor,
              },
            },
            xAxis: {
              ...axisColors,
              labels: { ...textStyles },
              title: { ...textStyles },
            },
            yAxis: [
              {
                ...axisColors,
                labels: { ...textStyles },
                title: { ...textStyles },
              },
              {
                ...axisColors,
                labels: { ...textStyles },
                title: { ...textStyles },
              },
            ],
          },
          false,
        )
        volumeSeries.update(
          {
            color: Highcharts.getOptions().colors[2],
          },
          false,
        )
      }

      chart.render()
    } catch (e) {
      console.error(e)
    }
  }

  setPriceData = (data) => {
    this.priceChart.series[PRICE_INDEX].setData(data)
  }

  setVolumeData = (data) => {
    this.priceChart.series[VOLUME_INDEX].setData(data)
  }

  render() {
    return (
      <div>
        <div id={containerID} />
      </div>
    )
  }
}

export default withThemeType(PriceGraph)
