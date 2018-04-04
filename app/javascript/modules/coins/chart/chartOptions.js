export default ({ news, prices, volume, sevenDayAvgVol }) => {
  const { Highcharts } = window
  return {
    rangeSelector: {
      selected: 1
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
        data: news,
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
