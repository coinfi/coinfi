import React, {Component} from 'react'
import Highcharts from 'highcharts/highstock'
import Switch from '../../Switch'
import fixOverlap from './fixOverlap'
import options from './options'
import chartOptions from './chartOptions'
window.Highcharts = Highcharts

const containerID = 'highcharts'

export default class PriceGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chart: null,
    }
  }

  componentDidMount() {
    let {priceData, newsItems} = this.props
    window.Highcharts.setOptions(options)
    const chart = window.Highcharts.stockChart(
      containerID,
      chartOptions({priceData, newsItems}),
    )
    this.setState({chart: chart})

    const newsChart = this.getNewsChart(chart)
    newsChart.hide()
  }

  getNewsChart(stockChart = null) {
    if (stockChart) return stockChart.series[1]

    const {chart} = this.state
    return chart && chart.series[1]
  }

  handleSwitchChange() {
    const newsChart = this.getNewsChart()
    newsChart.visible ? newsChart.hide() : newsChart.show()
  }

  isNewsChartVisible() {
    const newsChart = this.getNewsChart()
    return newsChart && newsChart.visible
  }

  render() {
    return (
      <div>
        {this.props.isTradingViewVisible && (
          <div className="flex items-center fr mr4">
            <span className="mr2 f6 silver">Show news</span>
            <Switch
              on={this.isNewsChartVisible()}
              onChange={() => this.handleSwitchChange()}
            />
          </div>
        )}
        <div id={containerID} />
      </div>
    )
  }
}
