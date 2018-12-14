import React, { Component } from 'react'
import Datafeed from './Datafeed'

const containerID = 'tradingview'

export default class TradingViewChart extends Component {
  getTradingView = () => {
    if (this.TradingView) {
      return this.TradingView
    }

    this.TradingView = window.TradingView
    return this.TradingView
  }

  componentDidMount() {
    // TODO: inject TV lib here
    const { symbol, priceData, priceDataHourly } = this.props
    const TradingView = this.getTradingView()

    // Options resource https://github.com/stevenGame/jr-chart/wiki/Widget-Constructor
    // chinese translation of the unavailable git wiki https://zlq4863947.gitbooks.io/tradingview/content/
    const tvWidget = new TradingView.widget({
      debug: false,
      fullscreen: false,
      symbol: symbol,
      interval: '60',
      container_id: containerID,
      datafeed: new Datafeed(priceData, priceDataHourly),
      library_path: '/tradingview/',
      // locale: 'en',
      // disabled_features: [
      // 'left_toolbar',
      // 'header_widget_dom_node',
      // 'header_resolutions',
      // 'header_settings',
      // 'header_compare',
      // 'header_screenshot',
      // 'header_undo_redo'
      // ],
      // drawings_access: {
      //   type: 'black',
      //   tools: [{ name: 'Regression Trend' }]
      // },
      // enabled_features: ['study_templates'],
      // charts_storage_url: 'http://saveload.tradingview.com',
      // charts_storage_api_version: '1.1',
      // client_id: 'tradingview.com',
      // user_id: 'public_user_id',
      width: '100%',
      favorites: {
        intervals: ['60', 'D'],
      },
      timeframe: '7d',
      time_frames: [
        { text: '1d', resolution: '60', description: '1 Day' },
        { text: '7d', resolution: '60', description: '7 Days' },
        { text: '1m', resolution: 'D', description: '1 Month' },
        { text: '3m', resolution: 'D', description: '3 Months' },
        { text: '6m', resolution: 'D', description: '6 Months' },
        { text: '1y', resolution: 'D', description: '1 Year' },
        { text: '1000y', resolution: 'D', description: 'All', title: 'All' },
      ],
    })
  }
  render() {
    return <div id={containerID} />
  }
}
