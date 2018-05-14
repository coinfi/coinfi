import Highcharts from 'highcharts/highstock'
import fixOverlap from './fixOverlap'
import options from './options'
import chartOptions from './chartOptions'
window.Highcharts = Highcharts

export default data => {
  const containerID = 'highcharts'
  if (!document.getElementById(containerID)) return
  window.Highcharts.setOptions(options)
  window.Highcharts.stockChart(containerID, chartOptions(data))
  fixOverlap()
}
