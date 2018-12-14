/*
 * Implementation of the JS API
 * See: https://github.com/tradingview/charting_library/wiki/JS-Api
 */
export default class Datafeed {
  constructor(data, hourlyData) {
    this.data = data
    this.hourlyData = hourlyData
  }
  onReady(callback) {
    setTimeout(() => {
      callback({
        supports_search: false,
        supports_group_request: false,
        supported_resolutions: ['60', 'D'],
        supports_marks: false,
        supports_timescale_marks: false,
      })
    }, 0)
  }
  resolveSymbol(ticker, resolve, reject) {
    // https://medium.com/@jonchurch/tradingview-charting-library-js-api-setup-for-crypto-part-1-57e37f5b3d5a
    setTimeout(() => {
      resolve({
        name: ticker,
        ticker,
        minmov: 1,
        pricescale: 1000000,
        has_intraday: true,
        supported_resolutions: ['60', 'D'],
        session: '24x7',
        timezone: 'UTC',
      })
    }, 0)
  }
  getBars(
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest,
  ) {
    /***
     * Examples
     * https://tw.saowen.com/a/68a2551d57bb26bf6be8e806c599a8269c0ad1691b11c7410e642822921a985c
     * http://www.hihubs.com/article/340
     */
    const data = resolution === 'D' ? this.data : this.hourlyData

    const bars = data
      .map((bar) => {
        return {
          time: bar.timestamp,
          volume: Number(bar.volume_to),
          open: Number(bar.open),
          close: Number(bar.close),
          low: Number(bar.low),
          high: Number(bar.high),
        }
      })
      .filter((data) => {
        const time = data.time / 1000
        return time >= from && time <= to
      })

    const isDataInRange = bars.length > 0
    const meta = {
      noData: !isDataInRange,
    }

    onHistoryCallback(bars, meta)
  }
  subscribeBars() {}
}
