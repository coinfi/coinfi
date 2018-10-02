/*
 * Implementation of the JS API
 * See: https://github.com/tradingview/charting_library/wiki/JS-Api
 */
import moment from 'moment'

export default class Datafeed {
  constructor(data) {
    this.data = data
  }
  onReady(callback) {
    setTimeout(() => {
      callback({
        supports_search: false,
        supports_group_request: false,
        supported_resolutions: ['D'],
        supports_marks: false,
        supports_timescale_marks: false,
      })
    }, 0)
  }
  resolveSymbol(ticker, resolve, reject) {
    // https://github.com/tradingview/charting_library/wiki/Symbology#symbolinfo-structure
    setTimeout(() => {
      resolve({
        name: ticker,
        ticker,
        minmov: 1,
        pricescale: 100,
        session: '24x7',
        timezone: 'Europe/London',
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
    /*
     * Doc: https://github.com/tradingview/charting_library/wiki/JS-Api#getbarssymbolinfo-resolution-from-to-onhistorycallback-onerrorcallback-firstdatarequest
     * Example: https://github.com/tradingview/charting_library/blob/e7771668fcb61b5f99d79103d2cc7e27452cae12/datafeeds/udf/lib/history-provider.js#L7
     */
    if (!firstDataRequest) return
    const bars = this.data.map((bar) => {
      // Need to convert `time` which is a date string into unix timestamp
      const timestamp = moment(bar.time).valueOf()

      return {
        time: timestamp,
        volume: Number(bar.volume_from),
        open: Number(bar.open),
        close: Number(bar.close),
        low: Number(bar.low),
        high: Number(bar.high),
      }
    })
    onHistoryCallback(bars)
  }
  subscribeBars() {}
}
