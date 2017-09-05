$(function() {
  $.getJSON('/historical/btc', function (data) {
    var prices = [],
        volume = [],
        dataLength = data.length,
        i = 0;

    for (i; i < dataLength; i += 1) {
      prices.push([
        data[i][0], // timestamp
        data[i][1], // price
      ]);
      volume.push([
        data[i][0], // timestamp
        data[i][2], // volume
      ]);
    }

    var lastDate = data[dataLength - 1][0],  // Get year of last data point
        days = 24 * 36e5; // Milliseconds in a day

    Highcharts.stockChart('chart', {
      rangeSelector: {
        selected: 1
      },

      title: {
        text: 'Bitcoin Price'
      },

      yAxis: [{
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Price'
        },
        height: '60%',
        lineWidth: 2
      }, {
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
      }],

      tooltip: {
        split: true
      },

      series: [{
        id: 'price',
        name: 'BTC',
        data: prices,
      }, {
        type: 'flags',
        //name: 'Flags on series',
        useHTML: true,
        dataLabels: {
          useHTML: true
        },
        data: [{
          x: lastDate - 60 * days,
          title: '<a href="#">On series</a>',
          text: ''
        }, {
          x: lastDate - 30 * days,
          title: 'On series',
          text: ''
        }],
        onSeries: 'price',
        shape: 'squarepin'
      }, {
        type: 'column',
        name: 'Volume',
        data: volume,
        yAxis: 1
      }]
    });
  });
});
