import React, { Component } from 'react'
import Highcharts from 'highcharts/highstock'
import fixOverlap from './fixOverlap'
import options from './options'
import chartOptions from './chartOptions'
window.Highcharts = Highcharts

const containerID = 'highcharts'

export default class PriceGraph extends Component {
  componentDidMount() {
    let { priceData, newsItems } = this.props
    window.Highcharts.setOptions(options)
    let chart = window.Highcharts.stockChart(
      containerID,
      chartOptions({ priceData, newsItems })
    )

    let $label = $('.highcharts-input-group .highcharts-label').eq(0).clone()
    let transform = $label.attr('transform')
    let translateX = transform.match(/\d+/)[0]
    let newTransform = transform.replace(translateX, '-110')

    $label.css('cursor', 'pointer')
    $label.addClass('highcharts-btn')
    $label.attr('transform', newTransform)
    $label.prepend('<rect fill="#f7f7f7" class="highcharts-button-box" x="0" y="0" width="100" height="22" rx="2" ry="2"></rect>')

    let $labelText = $label.find('text')
    $labelText.attr('x', 10).attr('style', 'font-weight:bold;color:#000000;fill:#000000;').text('News (On/Off)')
    $label.find('rect').attr('fill', '#e6ebf5')
    $label.html($label.html())
    $label.prependTo('.highcharts-input-group')


    // Fix the input group position is shifted to the left on the first time
    chart.redraw()

    // Toggle news chart
    $('.highcharts-btn, .highcharts-button:last-child').click(function(e) {
      let $labels = $('.highcharts-btn, .highcharts-button:last-child')

      e.preventDefault()
      e.stopPropagation()

      let series = chart.series[1]; // News chart
      let $rect = $labels.find('rect')
      let $text = $labels.find('text')

      if (series.visible) {
        series.hide();

        $rect.attr('fill', '#f7f7f7')
        $text.attr('style', 'font-weight:normal;color:#333333;fill:#333333;')
      } else {
        series.show();

        $rect.attr('fill', '#e6ebf5')
        $text.attr('style', 'font-weight:bold;color:#000000;fill:#000000;')
      }
    })
  }
  render() {
    return <div id={containerID} />
  }
}
