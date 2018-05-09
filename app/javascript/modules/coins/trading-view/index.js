const containerID = 'trading-view'
const { TradingView } = window
if (TradingView && document.getElementById(containerID)) {
  // TradingView.onready(() => {
  //   const widget = (window.tvWidget = new TradingView.widget({
  //     debug: false,
  //     fullscreen: false,
  //     symbol: 'AAPL',
  //     interval: 'D',
  //     container_id: containerID,
  //     datafeed: null, // Add data here
  //     library_path: 'charting_library/',
  //     locale: 'en',
  //     //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
  //     drawings_access: { type: 'black', tools: [{ name: 'Regression Trend' }] },
  //     disabled_features: ['use_localstorage_for_settings'],
  //     enabled_features: ['study_templates'],
  //     charts_storage_url: 'http://saveload.tradingview.com',
  //     charts_storage_api_version: '1.1',
  //     client_id: 'tradingview.com',
  //     user_id: 'public_user_id'
  //   }))
  // })
}
