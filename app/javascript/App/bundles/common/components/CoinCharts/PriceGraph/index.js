import React, { Component } from 'react'
import Highcharts from 'highcharts/highstock'
import options from './options'
import chartOptions from './chartOptions'

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
    let { priceData, priceDataHourly } = this.props

    this.Highcharts.setOptions(options)
    const chart = this.Highcharts.stockChart(
      containerID,
      chartOptions(this.Highcharts, {
        priceData,
        priceDataHourly,
        setPriceData: this.setPriceData,
        setVolumeData: this.setVolumeData,
      }),
    )
    this.priceChart = chart
    this.setState({ chart: chart })

    // Workaround to send a reference to the `priceChart` back up to a parent component. Ideally the
    // parent should not need reference to this `priceChart`
    if (this.props.onPriceChartCreated) {
      this.props.onPriceChartCreated(chart)
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
