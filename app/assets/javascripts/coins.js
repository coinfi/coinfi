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
        name: 'BTC',
        data: prices,
      }, {
        type: 'column',
        name: 'Volume',
        data: volume,
        yAxis: 1
      }]
    });
  });
});
