$(function() {
  // WebKit notifications
  if (Notification && Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  // Prevent flag overlap issues
  // https://github.com/highcharts/highcharts/issues/4674
  // http://jsfiddle.net/p037jdyj/
  (function (H) {
    function collide(a, b) {
      return !(b.x > a.x + a.width || b.x + b.width < a.x || b.y > a.y + a.height || b.y + b.height < a.y);
    }

    H.wrap(H.seriesTypes.flags.prototype, 'drawPoints', function (p) {
      var series = this,
      chart = series.chart,
      overlap = true,
      counter = 0,
      index,
      offset = series.options.stackDistance,
      currentBBox,
      compareBBox,
      compareSeries;

      p.call(this);

      // as long as flags do overlap, move them. Extra limiter up to 100 iterations.
      while (overlap && counter < 100) {
        overlap = false;
        H.each(series.points, function (currentPoint) {
          // only existing point with label
          if (currentPoint.graphic) {

            index = 0;
            currentBBox = {
              x: currentPoint.graphic.translateX,
              y: currentPoint.graphic.translateY,
              width: currentPoint.graphic.width,
              height: currentPoint.graphic.height
            };

            // compare only with previous series
            for (; series.index - index >= 0; index++) {
              compareSeries = chart.series[index];

              if (compareSeries.options.type === "flags") {

                H.each(compareSeries.points, function (comparePoint) {
                  // compare current label with all others
                  if (compareSeries === series && comparePoint.index >= currentPoint.index ) {
                    return;
                  }

                  if (comparePoint.graphic) {
                    // only existing point with label

                    compareBBox = {
                      x: comparePoint.graphic.translateX,
                      y: comparePoint.graphic.translateY,
                      width: comparePoint.graphic.width,
                      height: comparePoint.graphic.height
                    };

                    // when collide, move current label to top
                    if (collide(currentBBox, compareBBox)) {
                      overlap = true;
                      currentPoint.graphic.attr({
                        y: currentPoint.graphic.attr("y") - offset,
                        anchorY: currentPoint.plotY
                      });
                      currentPoint.tooltipPos[1] -= offset;
                    }
                  }
                });
              }
            }
          }
        });
        counter++;
      }
    });
  })(Highcharts);

  if (window.location.href.indexOf("/coins/") > -1) {
    var name = $('#name').text();
    var symbol = $('#symbol').text();
    $.getJSON('/delayed_historical/' + symbol.toLowerCase() + '.json', function (data) {
      var historical = data["prices"],
          news = data["news"],
          prices = [],
          volume = [],
          sevenDayAvgVol = [],
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
        if (i > 7) {
          var mean = (volume[i][1] + volume[i-1][1] + volume[i-2][1] + volume[i-3][1] + volume[i-4][1] + volume[i-5][1] + volume[i-6][1] + volume[i-7][1]) / 7.0;
          sevenDayAvgVol.push([
            historical[i][0] * 1000, // timestamp
            mean
          ]);
        }
      }

      Highcharts.setOptions({
        lang: {
          thousandsSep: ','
        },
        // http://jkunst.com/highcharts-themes-collection/
        // https://raw.githubusercontent.com/jbkunst/highcharts-themes-collection/gh-pages/themes/google.js
        "colors": [
          "#26afda",
          "#F90101",
          "#d35400",
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
        chart: {
          events: {
            load: function() {
              var priceSeries = this.series[0];
              var avgVolSeries = this.series[1];
              var volumeSeries = this.series[3];
              var currentTimestamp = Math.round((new Date()).getTime()) - 60*60*24*90*1000; // 90 days before
              var alerted = false;
              setInterval(function() {
                if (currentTimestamp < (new Date()).getTime()) {
                  var avgVol = volumeSeries.data.slice(-7).reduce(function(a, b) { return a + b.y; }, 0) / 7.0;
                  $.getJSON("/historical/" + symbol + "/" + Math.round(currentTimestamp/1000) + ".json", function(data) {
                    // Volume detection
                    var currentVolume = data["volume"];
                    var previousVolume = volumeSeries.data[volumeSeries.data.length - 1].y;
                    var boolean = !alerted && currentVolume > previousVolume * 4 && Notification && Notification.permission == "granted";
                    if (boolean) {
                      var notification = new Notification("Abnormal Volume Detected for " + name, {
                        icon: "https://blog.coinfi.com/CoinFi%20Logo%20Square.png",
                        body: "The current volume is 2σ higher than the average normally!"
                      });
                      alerted = true;
                    }

                    var timestamp = data["timestamp"] * 1000;
                    priceSeries.addPoint([timestamp, data["price"]], true, true);
                    volumeSeries.addPoint([timestamp, data["volume"]], true, true);
                    avgVolSeries.addPoint([timestamp, avgVol], true, true);

                    currentTimestamp += 60 * 60 * 24 * 1000; // increase timestamp by one day!
                  });
                }
              }, 3000);
            }
          }
        },

        rangeSelector: {
          selected: 1
        },

        legend: {
          enabled: true,
          layout: 'vertical',
          align: 'left',
          verticalAlign: 'top',
          backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },

        yAxis: [{
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'USD Price'
          },
          height: '60%',
          lineWidth: 2
        }, {
          labels: {
            align: 'left',
            x: -3
          },
          title: {
            text: 'Avg Vol'
          },
          height: '60%',
          opposite: false,
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
          hideDelay: 1000,
          shared: true
        },

        series: [{
          id: 'price',
          name: 'USD Price',
          data: prices
        }, {
          id: '7dayAvgVol',
          name: 'Moving Average Volume',
          data: sevenDayAvgVol,
          visible: false,
          yAxis: 1
        //}, {
        //  name: 'Signal 1',
        //  visible: false
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
          id: 'volume',
          type: 'column',
          name: 'Volume',
          data: volume,
          color: Highcharts.getOptions().colors[2],
          yAxis: 2
        }]
      });
    });
  }
});
