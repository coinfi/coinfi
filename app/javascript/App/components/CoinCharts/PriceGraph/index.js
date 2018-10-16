import React, { Component } from 'react'
import Highcharts from 'highcharts/highstock'
import Switch from '../../Switch'
import options from './options'
import chartOptions from './chartOptions'
import moment from 'moment'

const containerID = 'highcharts'

class PriceGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chart: null,
    }
    this.Highcharts = Highcharts
  }

  componentDidMount() {
    let { priceData, annotations } = this.props

    const epochPrices = priceData.map((datum) => {
      return {
        ...datum,
        timestamp: moment.utc(datum.time).valueOf(),
      }
    })

    this.Highcharts.setOptions(options)
    const chart = this.Highcharts.stockChart(
      containerID,
      chartOptions(this.Highcharts, { priceData: epochPrices, annotations }),
    )
    this.priceChart = chart
    this.setState({ chart: chart })

    // Workaround to send a reference to the `priceChart` back up to a parent component. Ideally the
    // parent should not need reference to this `priceChart`
    if (this.props.onPriceChartCreated) {
      this.props.onPriceChartCreated(chart)
    }

    const annotatedChart = this.getAnnotatedChart(chart)
    annotatedChart.show()
  }

  getAnnotatedChart(stockChart = null) {
    if (stockChart) return stockChart.series[1]

    const { chart } = this.state
    return chart && chart.series[1]
  }

  handleAnnotationToggle() {
    const annotatedChart = this.getAnnotatedChart()
    annotatedChart.visible ? annotatedChart.hide() : annotatedChart.show()
  }

  isAnnotatedChartVisible() {
    const annotatedChart = this.getAnnotatedChart()
    return annotatedChart && annotatedChart.visible
  }

  render() {
    return (
      <div>
        <div className="flex items-center fr mr4">
          <span className="mr2 f6 silver">Show Annotations</span>
          <Switch
            on={() => this.isAnnotatedChartVisible()}
            onChange={() => this.handleAnnotationToggle()}
          />
        </div>
        <div id={containerID} />
      </div>
    )
  }
}

export default PriceGraph
