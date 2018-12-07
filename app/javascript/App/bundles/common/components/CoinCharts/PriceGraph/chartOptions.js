const parseData = (priceData) => {
  const prices = []
  const volume = []
  priceData.forEach((day) => {
    let { timestamp: time, close: price, volume_to: vol } = day
    prices.push([time, price])
    volume.push([time, vol])
  })
  return { prices, volume }
}

export default (Highcharts, data) => {
  const { priceData, priceDataHourly, setPriceData, setVolumeData } = data
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
        id: 'volume',
        type: 'column',
        name: 'USD Volume',
        data: volume,
        color: Highcharts.getOptions().colors[2],
        yAxis: 1,
      },
    ],
  }
}
