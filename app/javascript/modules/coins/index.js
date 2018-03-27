import Highcharts from 'highcharts/highstock'
import fixOverlap from './fixOverlap'
import fetchData from './fetchData'
import options from './options'
import chartOptions from './chartOptions'

if (window.location.href.indexOf('/coins/') > -1) {
  fetchData().then(data => {
    Highcharts.setOptions(options)
    Highcharts.stockChart('chart', chartOptions(Highcharts, data))
    fixOverlap(Highcharts)
  })
}
