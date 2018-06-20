import parseData from './parseData'
export default (data) => {
  const { newsItems } = data
  const { prices, volume } = parseData(data)
  const { Highcharts } = window
  return {
    rangeSelector: {
      selected: 1,
      buttons: [{
        type: 'month',
        count: 1,
        text: '1m'
      }, {
        type: 'month',
        count: 3,
        text: '3m'
      }, {
        type: 'month',
        count: 6,
        text: '6m'
      }, {
        type: 'ytd',
        text: 'YTD'
      }, {
        type: 'year',
        count: 1,
        text: '1y'
      }, {
        type: 'all',
        text: 'All'
      }, {
        text: 'News (On/Off)',
        events: {
          click: function() {
            return false;
          }
        }
      }],
      buttonTheme: {
        width: null,
        padding: 5
      },
      inputPosition: {
        x: 110
      }
    },
    navigator: {
      enabled: false
    },

    legend: {
      enabled: false,
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      backgroundColor:
        (Highcharts.theme && Highcharts.theme.legendBackgroundColor) ||
        '#FFFFFF'
    },

    yAxis: [
      {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'USD Price'
        },
        height: '60%',
        lineWidth: 2
      },
      {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }
    ],

    tooltip: {
      style: {
        width: '200px'
      },
      valueDecimals: 4,
      xDateFormat: '%A, %b %e, %Y',
      useHTML: true,
      hideDelay: 1000,
      shared: true
    },
    plotOptions: {
      flags: {
        cursor: 'pointer',
        point: {
          events: {
            click: function() {
              window.open(this.url, '_blank')
            }
          }
        }
      }
    },
    series: [
      {
        id: 'price',
        name: 'USD Price',
        data: prices
      },
      {
        type: 'flags',
        name: 'News',
        useHTML: true,
        dataLabels: {
          useHTML: true
        },
        data: newsItems,
        onSeries: 'price',
        shape: 'circlepin'
      },
      {
        id: 'volume',
        type: 'column',
        name: 'Volume',
        data: volume,
        color: Highcharts.getOptions().colors[2],
        yAxis: 1
      }
    ]
  }
}
