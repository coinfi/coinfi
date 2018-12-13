export default (Highcharts, data) => {
  const {
    pricesHourly,
    volumesHourly,
    currency,
    setToHourly,
    setToDaily,
  } = data

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
    ],
  }
}
