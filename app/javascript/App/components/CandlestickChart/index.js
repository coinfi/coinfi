import React from 'react'
import Datafeed from './Datafeed'
const { TradingView } = window

const containerID = 'tradingview'

export default class CandlestickChart extends React.Component {
  componentDidMount() {
    // TODO: inject TV lib here
    const { symbol } = this.props
    let priceData = document
      .getElementById('coin-charts')
      .getAttribute('data-prices')
    priceData = JSON.parse(priceData)
    window.tvWidget = new TradingView.widget({
      debug: false,
      fullscreen: false,
      symbol: symbol,
      interval: 'D',
      container_id: containerID,
      datafeed: new Datafeed(priceData),
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
  render() {
    return <div id={containerID} />
  }
}
