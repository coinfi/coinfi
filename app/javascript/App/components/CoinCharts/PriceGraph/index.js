import React, { Component } from 'react'
import Highcharts from 'highcharts/highstock'
import Switch from '../../Switch'
import options from './options'
import chartOptions from './chartOptions'
window.Highcharts = Highcharts

const containerID = 'highcharts'

class PriceGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chart: null
    }
  }

  componentDidMount() {
    let { priceData, annotations } = this.props
    window.Highcharts.setOptions(options)
    const chart = window.Highcharts.stockChart(
      containerID,
      chartOptions({ priceData, annotations })
    )
    this.setState({ chart: chart })

    const annotatedChart = this.getAnnotatedChart(chart)
    annotatedChart.hide()
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
            on={this.isAnnotatedChartVisible()}
            onChange={() => this.handleAnnotationToggle()}
          />
        </div>
        <div id={containerID} />
      </div>
    )
  }
}

export default PriceGraph
