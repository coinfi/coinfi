import _ from 'lodash'
import moment from 'moment'

const parseData = (priceData) => {
  const prices = []
  const volume = []
  priceData.forEach((day) => {
    let { timestamp: time, close: price, volume_from: vol } = day
    prices.push([time, price])
    volume.push([time, vol])
  })
  return { prices, volume }
}

export default (Highcharts, data) => {
  const {
    annotations,
    priceData,
    priceDataHourly,
    setPriceData,
    setVolumeData,
  } = data
  const { prices, volume } = parseData(priceDataHourly)

  const setToHourly = () => {
    const { prices, volume } = parseData(priceDataHourly)
    setPriceData(prices)
    setVolumeData(volume)
  }
  const setToDaily = () => {
    const { prices, volume } = parseData(priceData)
    setPriceData(prices)
    setVolumeData(volume)
  }
  const annotationData = annotations.map((datum) => {
    // align time to start of day
    const baseX = moment
      .utc(datum.x)
      .startOf('day')
      .valueOf()

    // search for nearest available day with price going forward
    let x = baseX
    let foundPrice
    for (let i = 1; i < 6; i++) {
      foundPrice = _.find(prices, (price) => price[0] == x)
      if (!foundPrice) {
        x = moment
          .utc(datum.x)
          .startOf('day')
          .add(i, 'days')
          .valueOf()
      }
    }

    return {
      ...datum,
      x: foundPrice ? x : baseX,
      y: foundPrice ? foundPrice[1] : 0,
    }
  })

  // enhance high charts with annotation labels
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
    Highcharts.each(point.series.chart.series[1].points, (point) => {
      point.dataLabel
        .attr({
          fill: '#fff',
          stroke: '#d5d9db',
          color: '#757575',
        })
        .css({
          color: '#757575',
        })
    })
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
    chart.labelGroup = chart.renderer.g('labelGroup').add(chart.mainGroup)
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
        fontSize: 13,
        fontWeight: 500,
        lineHeight: 18,
      })
      .add(chart.textGroup)

    chart.label = chart.renderer
      .label(data.title, chart.chartWidth / 2, 40, 'rect')
      .attr({
        'text-align': 'center',
        width: 24,
        height: 24,
        padding: 0,
        fill: '#2faeed',
        r: 2,
      })
      .css({
        color: '#fff',
        fontSize: 14,
      })
      .add(chart.labelGroup)

    const textLink = `<a href="${data.url}" target="_blank">${
      data.url
    }</a> ・ ${moment(data.x).fromNow()}`
    chart.textLink = chart.renderer
      .text(textLink, chart.chartWidth / 2, 110, false)
      .css({
        fontSize: 11,
        color: '#808080',
      })
      .add(chart.linkGroup)

    // position all elements
    const rectInfo = chart.rect.getBBox()
    chart.label.text.translate(0, 3)
    chart.mainGroup.translate(-rectInfo.width / 2 - 10, -20)
    chart.textGroup.translate(54, 28)
    chart.labelGroup.translate(15, 15)
    chart.linkGroup.translate(54, 0)
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

  return {
    chart: {
      marginTop: 120, // space for inline label
      events: {
        redraw: function() {
          let chart = this
          if (typeof chart.clickedData === 'undefined') {
            const clickedData = annotationData[0]
            chart.clickedData = { ...clickedData }
          }
          chart.createLabel(chart, chart.clickedData)
        },
      },
    },

    rangeSelector: {
      selected: 0,
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
          text: 'USD Price',
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
      shared: true,
    },
    plotOptions: {
      flags: {
        cursor: 'pointer',
        point: {
          events: {
            click: function() {
              window.open(this.url, '_blank')
            },
          },
        },
      },
      series: {
        turboThreshold: 2000,
      },
    },
    series: [
      {
        id: 'price',
        name: 'USD Price',
        data: prices,
      },
      {
        id: 'news',
        type: 'scatter',
        name: 'Annotations',
        data: annotationData,
        onSeries: 'price',
        shape: 'circlepin',
        animation: false,
        cursor: 'pointer',
        point: {
          events: {
            click: function() {
              const point = this
              const chart = point.series.chart
              const data = {
                x: point.x,
                y: point.y,
                title: point.title,
                text: point.text,
                url: point.url,
              }

              chart.clickedData = data // used for redraw event
              chart.createLabel(chart, data)
              chart.colorDataLabel(point)
            },
          },
        },
        // enableMouseTracking: false,
        tooltip: {
          pointFormat: '{point.title}',
        },
        color: '#2faeed',
        marker: {
          fillColor: '#fff',
          lineWidth: 1,
          lineColor: '#2faeed',
        },
        dataLabels: {
          enabled: true,
          borderRadius: 2,
          padding: 5,
          color: '#757575',
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#d5d9db',
          style: {
            textOutline: '0px #757575',
            fontWeight: 500,
            fontSize: 14,
            width: 20,
          },
          y: -15,
          formatter: function() {
            return `${this.point.title}`
          },
        },
      },
      {
        id: 'volume',
        type: 'column',
        name: 'Volume',
        data: volume,
        color: Highcharts.getOptions().colors[2],
        yAxis: 1,
      },
    ],
  }
}
