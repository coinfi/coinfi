import React from 'react'
import Highcharts from 'highcharts/highstock'
import fixOverlap from './fixOverlap'
import options from './options'
import chartOptions from './chartOptions'
window.Highcharts = Highcharts

const containerID = 'highcharts'

export default class PriceGraph extends React.Component {
  componentDidMount() {
    let priceData = document
      .getElementById('coin-charts')
      .getAttribute('data-prices')
    priceData = JSON.parse(priceData)
    let { articles } = this.props
    articles = JSON.parse(articles)
    window.Highcharts.setOptions(options)
    window.Highcharts.stockChart(
      containerID,
      chartOptions({ priceData, articles })
    )
    fixOverlap()
  }
  render() {
    return <div id={containerID} />
  }
}
