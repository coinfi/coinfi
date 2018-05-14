import Datafeed from './Datafeed'
const { TradingView } = window

export default ({prices, symbol, containerID}) => {
  // TODO: inject TV lib here
  window.tvWidget = new TradingView.widget({
    debug: false,
    fullscreen: false,
    symbol: symbol,
    interval: 'D',
    container_id: containerID,
    datafeed: new Datafeed(prices), // TODO: tie datafeed and redux more closely
    library_path: '/tradingview/',
    locale: 'en',
    //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
    drawings_access: {
      type: 'black',
      tools: [{ name: 'Regression Trend' }]
    },
    disabled_features: [
      'left_toolbar',
      'header_widget_dom_node',
      'header_resolutions',
      'header_settings',
      'header_compare',
      'header_screenshot',
      'header_undo_redo'
    ],
    enabled_features: ['study_templates'],
    charts_storage_url: 'http://saveload.tradingview.com',
    charts_storage_api_version: '1.1',
    client_id: 'tradingview.com',
    user_id: 'public_user_id'
  })
}
