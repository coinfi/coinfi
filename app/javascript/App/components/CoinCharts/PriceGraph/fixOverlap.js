export default () => {
  const {Highcharts} = window
  // Prevent flag overlap issues
  // https://github.com/highcharts/highcharts/issues/4674
  // http://jsfiddle.net/p037jdyj/
  ;(function(H) {
    function collide(a, b) {
      return !(
        b.x > a.x + a.width ||
        b.x + b.width < a.x ||
        b.y > a.y + a.height ||
        b.y + b.height < a.y
      )
    }

    H.wrap(H.seriesTypes.flags.prototype, 'drawPoints', function(p) {
      let series = this,
        chart = series.chart,
        overlap = true,
        counter = 0,
        index,
        offset = series.options.stackDistance,
        currentBBox,
        compareBBox,
        compareSeries

      p.call(this)

      // as long as flags do overlap, move them. Extra limiter up to 100 iterations.
      while (overlap && counter < 100) {
        overlap = false
        H.each(series.points, currentPoint => {
          // only existing point with label
          if (currentPoint.graphic) {
            index = 0
            currentBBox = {
              x: currentPoint.graphic.translateX,
              y: currentPoint.graphic.translateY,
              width: currentPoint.graphic.width,
              height: currentPoint.graphic.height,
            }

            // compare only with previous series
            for (; series.index - index >= 0; index++) {
              compareSeries = chart.series[index]

              if (compareSeries.options.type === 'flags') {
                H.each(compareSeries.points, comparePoint => {
                  // compare current label with all others
                  if (
                    compareSeries === series &&
                    comparePoint.index >= currentPoint.index
                  ) {
                    return
                  }

                  if (comparePoint.graphic) {
                    // only existing point with label

                    compareBBox = {
                      x: comparePoint.graphic.translateX,
                      y: comparePoint.graphic.translateY,
                      width: comparePoint.graphic.width,
                      height: comparePoint.graphic.height,
                    }

                    // when collide, move current label to top
                    if (collide(currentBBox, compareBBox)) {
                      overlap = true
                      currentPoint.graphic.attr({
                        y: currentPoint.graphic.attr('y') - offset,
                        anchorY: currentPoint.plotY,
                      })
                      currentPoint.tooltipPos[1] -= offset
                    }
                  }
                })
              }
            }
          }
        })
        counter++
      }
    })
  })(Highcharts)
}
