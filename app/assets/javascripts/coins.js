$(function() {
  if (window.location.href.indexOf("/coins/") > -1) {
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
          historical[i][0] * 1000, // timestamp
          historical[i][1], // price
        ]);
        volume.push([
          historical[i][0] * 1000, // timestamp
          historical[i][2], // volume
        ]);
      }

      Highcharts.setOptions({
        lang: {
          thousandsSep: ','
        },
        // http://jkunst.com/highcharts-themes-collection/
        // https://raw.githubusercontent.com/jbkunst/highcharts-themes-collection/gh-pages/themes/google.js
        "colors": [
          "#0266C8",
          "#F90101",
          "#F2B50F",
          "#00933B"
        ],
        "chart": {
          "style": {
            "fontFamily": "Roboto",
            "color": "#444444"
          }
        },
        "xAxis": {
          "gridLineWidth": 1,
          "gridLineColor": "#F3F3F3",
          "lineColor": "#F3F3F3",
          "minorGridLineColor": "#F3F3F3",
          "tickColor": "#F3F3F3",
          "tickWidth": 1
        },
        "yAxis": {
          "gridLineColor": "#F3F3F3",
          "lineColor": "#F3F3F3",
          "minorGridLineColor": "#F3F3F3",
          "tickColor": "#F3F3F3",
          "tickWidth": 1
        },
        "legendBackgroundColor": "rgba(0, 0, 0, 0.5)",
        "background2": "#505053",
        "dataLabelsColor": "#B0B0B3",
        "textColor": "#C0C0C0",
        "contrastTextColor": "#F0F0F3",
        "maskColor": "rgba(255,255,255,0.3)"
      });

      Highcharts.stockChart('chart', {
        rangeSelector: {
          selected: 1
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
  }
});
