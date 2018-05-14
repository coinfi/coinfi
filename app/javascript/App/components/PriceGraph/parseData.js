export default ({ priceData }) => {
  const prices = []
  const volume = []
  priceData.forEach(day => {
    let { timestamp: time, close: price, volume_from: vol } = day
    time = time * 1000
    prices.push([time, price - 0])
    volume.push([time, vol - 0])
  })
  return { prices, volume }
}
