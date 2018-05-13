export default ({ prices: data, articles: news }) => {
  const historical = data.map(el => [
    el.timestamp,
    el.close - 0,
    el.volume_from - 0
  ])
  const prices = [],
    volume = []

  historical.forEach((item, i) => {
    prices.push([
      historical[i][0] * 1000, // timestamp
      historical[i][1] // price
    ])
    volume.push([
      historical[i][0] * 1000, // timestamp
      historical[i][2] // volume
    ])
  })
  return { historical, news, prices, volume }
}
