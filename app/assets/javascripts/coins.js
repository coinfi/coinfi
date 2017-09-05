$(function() {
  $.getJSON('/historical/btc', function (data) {
    Highcharts.stockChart('chart', {
      rangeSelector: {
        selected: 1
      },

      title: {
        text: 'Bitcoin Price'
      },

      series: [{
        name: 'BTC',
        data: data
      }]
    });
  });
});
