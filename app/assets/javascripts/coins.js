$(function() {
  var name = $('#name').text();
  var symbol = $('#symbol').text();
  $.getJSON('/historical/' + symbol.toLowerCase() + '.json', function (data) {
    var historical = data["prices"],
        news = data["news"],
        prices = [],
        volume = [],
        historicalLength = historical.length,
        i = 0;

    for (i; i < historicalLength; i += 1) {
      prices.push([
        historical[i][0], // timestamp
        historical[i][1], // price
      ]);
      volume.push([
        historical[i][0], // timestamp
        historical[i][2], // volume
      ]);
    }

    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    });

    Highcharts.stockChart('chart', {
      rangeSelector: {
        selected: 1
      },

      title: {
        text: name + ' Price'
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
        style: {
          width: '200px'
        },
        valueDecimals: 4,
        xDateFormat: '%A, %b %e, %Y',
        useHTML: true,
        hideDelay: 1500,
        shared: true
      },

      series: [{
        id: 'price',
        name: 'USD',
        data: prices,
      }, {
        type: 'flags',
        name: 'News',
        useHTML: true,
        dataLabels: {
          useHTML: true
        },
        data: news,
        onSeries: 'price',
        shape: 'circlepin'
      }, {
        type: 'column',
        name: 'Volume',
        data: volume,
        yAxis: 1
      }]
    });
  });
});
