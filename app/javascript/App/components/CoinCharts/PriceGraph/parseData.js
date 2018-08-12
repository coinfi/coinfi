export default ({ priceData }) => {
  const prices = []
  const volume = []
  priceData.forEach((day) => {
    let { timestamp: time, close: price, volume_from: vol } = day
    prices.push([time, price])
    volume.push([time, vol])
    //debugger
  })
  return { prices, volume }
}
