import Highcharts from 'highcharts/highstock'
import fixOverlap from './fixOverlap'
import fetchData from './fetchData'
import options from './options'
import chartOptions from './chartOptions'
window.Highcharts = Highcharts

if (window.location.href.indexOf('/coins/') > -1) {
  document.addEventListener('DOMContentLoaded', () => {
    fetchData().then(data => {
      window.Highcharts.setOptions(options)
      window.Highcharts.stockChart('chart', chartOptions(data))
      fixOverlap()
    })
  })
}
