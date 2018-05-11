import fetchPrices from '../fetchPrices'

export default () => {
  return new Promise(resolve => {
    const friendlyID = window.location.pathname.split('/').reverse()[0]
    const symbol = $('#symbol')
      .data('coin-symbol')
      .toLowerCase()
    let historical = []
    let news = []
    const articles = $.getJSON(`/api/coins/${friendlyID}/news.json`, data => {
      news = data['payload']['news']
    })
    fetchPrices(symbol).then(data => {
      historical = $.map(data, el => {
        return [[el.timestamp, el.close - 0, el.volume_from - 0]]
      })
      $.when(articles).done(() => {
        const prices = [],
          volume = [],
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
        }
        resolve({ historical, news, prices, volume })
      })
    })
  })
}
