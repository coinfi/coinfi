import _ from 'lodash'
import moment from 'moment'

const PRICE_SERIES_INDEX = 0
const VOLUME_SERIES_INDEX = 1
const ANNOTATION_SERIES_INDEX = 2

export default (Highcharts, data) => {
  const {
    pricesHourly,
    volumesHourly,
    annotationData,
    currency,
    setToHourly,
    setToDaily,
  } = data

  const hasAnnotations = _.isArray(annotationData) && !_.isEmpty(annotationData)
  const extractAnnotationData = function(point) {
    return {
      x: point.x,
      y: point.y,
      total_signals: point.total_signals,
      text: point.text,
      name: point.signal_type_name,
    }
  }

  // enhance high charts with annotation labels
  if (hasAnnotations) {
    Highcharts.addEvent(Highcharts.Series, 'afterRender', function() {
      Highcharts.each(this.points, (p) => {
        if (p.dataLabel) {
          p.dataLabel.point = p
        }
      })
    })

    Highcharts.seriesTypes.line.prototype.trackerGroups = ['dataLabelsGroup']
    Highcharts.seriesTypes.line.prototype.drawTracker =
      Highcharts.TrackerMixin.drawTrackerPoint

    Highcharts.Chart.prototype.colorDataLabel = function(point) {
      Highcharts.each(
        point.series.chart.series[ANNOTATION_SERIES_INDEX].points,
        (point) => {
          point.dataLabel
            .attr({
              fill: '#fff',
              stroke: '#d5d9db',
              color: '#757575',
            })
            .css({
              color: '#757575',
            })
        },
      )
      point.dataLabel
        .attr({
          fill: '#2faeed',
          stroke: '#2faeed',
        })
        .css({
          color: '#fff',
        })
    }

    Highcharts.Chart.prototype.createLabel = function(chart, data) {
      // initialize label
      if (chart.mainGroup) {
        chart.mainGroup.destroy()
        chart.mainGroup = undefined
      }

      // create renderers and group together
      chart.mainGroup = chart.renderer.g('mainGroup').add()
      chart.textGroup = chart.renderer.g('textGroup').add(chart.mainGroup)
      chart.linkGroup = chart.renderer.g('linkGroup').add(chart.mainGroup)

      // initialize all renderers
      chart.rect = chart.renderer
        .rect(chart.chartWidth / 2, 40, chart.chartWidth * 0.97, 90)
        .attr({
          stroke: '#000',
          'stroke-width': 1,
          opacity: 0.1,
          r: 2,
        })
        .add(chart.mainGroup)
        .shadow({
          color: '#000',
          offsetX: 0,
          offsetY: 2,
          opacity: 0.15,
          width: 2,
        })

      chart.text = chart.renderer
        .text(data.text, chart.chartWidth / 2, 40)
        .attr({
          stroke: '#000',
          'stroke-width': 0,
        })
        .css({
          width: chart.chartWidth * 0.97 - 69,
          'white-space': 'no-wrap',
          fontSize: 16,
          fontWeight: 500,
          lineHeight: 18,
        })
        .add(chart.textGroup)

      const addendum = data.total_signals
        ? ` ・ +${data.total_signals - 1} signals`
        : ''
      const textLink = `Whale Transfer Into Exchange ・ ${moment(
        data.x,
      ).fromNow()}${addendum}`
      chart.textLink = chart.renderer
        .text(textLink, chart.chartWidth / 2, 110, false)
        .css({
          fontSize: 11,
          color: '#808080',
        })
        .add(chart.linkGroup)

      // position all elements
      const rectInfo = chart.rect.getBBox()
      chart.mainGroup.translate(-rectInfo.width / 2, -20)
      chart.textGroup.translate(15, 30)
      chart.linkGroup.translate(15, 0)
    }

    Highcharts.Chart.prototype.reflowMainLabeL = function(chart) {
      chart.renderer
        .rect(chart.spacingBox.width / 2 - 100, 200, 200, 200)
        .attr({
          stroke: '#000',
          'stroke-width': 1,
        })
        .add()
    }
  }

  return {
    rangeSelector: {
      selected: 1,
      buttons: [
        {
          type: 'day',
          count: 1,
          text: '1d',
          events: {
            click: function() {
              setToHourly()
            },
          },
        },
        {
          type: 'day',
          count: 7,
          text: '7d',
          events: {
            click: function() {
              setToHourly()
            },
          },
        },
        {
          type: 'month',
          count: 1,
          text: '1m',
          events: {
            click: function() {
              setToDaily()
            },
          },
        },
        {
          type: 'month',
          count: 3,
          text: '3m',
          events: {
            click: function() {
              setToDaily()
            },
          },
        },
        {
          type: 'month',
          count: 6,
          text: '6m',
          events: {
            click: function() {
              setToDaily()
            },
          },
        },
        {
          type: 'year',
          count: 1,
          text: '1y',
          events: {
            click: function() {
              setToDaily()
            },
          },
        },
        {
          type: 'all',
          text: 'All',
          events: {
            click: function() {
              setToDaily()
            },
          },
        },
      ],
    },
    navigator: {
      enabled: false,
    },
    chart: {
      height: 500,
      ...(hasAnnotations && {
        marginTop: 120, // space for inline label
        events: {
          redraw: function() {
            let chart = this
            if (typeof chart.clickedData === 'undefined') {
              const point = _.get(annotationData, 0)
              if (point) {
                const clickedData = extractAnnotationData(point)
                chart.clickedData = clickedData
                chart.createLabel(chart, clickedData)
                chart.colorDataLabel(point)
              }
            }
          },
        },
      }),
    },
    legend: {
      enabled: false,
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      backgroundColor:
        (Highcharts.theme && Highcharts.theme.legendBackgroundColor) ||
        '#FFFFFF',
    },
    time: {
      useUTC: true,
    },
    yAxis: [
      {
        labels: {
          align: 'right',
          x: -3,
        },
        title: {
          text: `${currency} Price`,
        },
        height: '60%',
        lineWidth: 2,
      },
      {
        labels: {
          align: 'right',
          x: -3,
        },
        title: {
          text: 'Volume',
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2,
      },
    ],
    tooltip: {
      style: {
        width: '200px',
      },
      valueDecimals: 4,
      xDateFormat: '%A, %b %e, %Y %H:%M',
      useHTML: true,
      hideDelay: 1000,
      split: true,
    },
    plotOptions: {
      series: {
        turboThreshold: 2000,
      },
    },
    series: [
      {
        id: 'price',
        name: `${currency} Price`,
        data: pricesHourly,
      },
      {
        id: 'volume',
        type: 'column',
        name: `${currency} Volume`,
        data: volumesHourly,
        color: Highcharts.getOptions().colors[2],
        yAxis: 1,
      },
      hasAnnotations
        ? {
            id: 'signals',
            type: 'scatter',
            name: `Signal`,
            data: annotationData,
            shape: 'circlepin',
            cursor: 'pointer',
            point: {
              events: {
                click: function() {
                  const point = this
                  const chart = point.series.chart
                  const data = extractAnnotationData(point)

                  chart.clickedData = data // used for redraw event
                  chart.createLabel(chart, data)
                  chart.colorDataLabel(point)
                },
              },
            },
            label: {
              enabled: false,
            },
            tooltip: {
              xDateFormat: '%A, %b %e, %Y %H:%M',
              useHTML: true,
              split: true,
              pointFormatter() {
                console.log(this)
                return `${this.signal_type_name}`
              },
            },
            color: '#2faeed',
            marker: {
              fillColor: '#fff',
              lineWidth: 1,
              lineColor: '#2faeed',
            },
            dataLabels: {
              enabled: false,
            },
          }
        : {},
    ],
  }
}
