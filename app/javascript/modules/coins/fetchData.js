export default () => {
  return new Promise(resolve => {
    const friendlyID = window.location.pathname.split('/').reverse()[0]
    $.getJSON('/coins/' + friendlyID + '/historical_data.json', data => {
      const historical = data['prices'],
        news = data['news'],
        prices = [],
        volume = [],
        sevenDayAvgVol = [],
        historicalLength = historical.length
      let i = 0

      for (i; i < historicalLength; i += 1) {
        prices.push([
          historical[i][0] * 1000, // timestamp
          historical[i][1] // price
        ])
        volume.push([
          historical[i][0] * 1000, // timestamp
          historical[i][2] // volume
        ])
        if (i > 7) {
          let mean =
            (volume[i][1] +
              volume[i - 1][1] +
              volume[i - 2][1] +
              volume[i - 3][1] +
              volume[i - 4][1] +
              volume[i - 5][1] +
              volume[i - 6][1] +
              volume[i - 7][1]) /
            7.0
          sevenDayAvgVol.push([
            historical[i][0] * 1000, // timestamp
            mean
          ])
        }
      }
      resolve({ historical, news, prices, volume, sevenDayAvgVol })
    })
  })
}
