import React, { Component } from 'react'
import _ from 'lodash'
import Datafeed from './Datafeed'
import { withStyles, createStyles } from '@material-ui/core/styles'
import LoadingIndicator from '~/bundles/common/components/LoadingIndicator'
const containerID = 'tradingview'

/***
 * Darkmode is implemented by using filters to achieve a reasonable background colour/colour scheme
 * This calculator was used to get the desired filter: https://codepen.io/sosuke/pen/Pjoqqp
 * Based off the following stack overflow answer: https://stackoverflow.com/a/43960991/604861
 * True to background colour (dark-pine-green)
 *  filter: invert(92%) sepia(16%) saturate(3707%) hue-rotate(166deg) brightness(94%) contrast(96%);
 * Possibly better looking colours
 *  filter: invert(92%) sepia(58%) saturate(662%) hue-rotate(157deg) brightness(97%) contrast(98%);
 */

const styles = (theme) => {
  const isDarkMode = theme.palette.type === 'dark'

  return createStyles({
    root: {
      ...(isDarkMode && {
        filter:
          'invert(92%) sepia(58%) saturate(662%) hue-rotate(157deg) brightness(97%) contrast(98%)',
      }),
    },
  })
}

class TradingViewChart extends Component {
  TradingView
  tvWidget
  resetHandler

  state = {
    ready: false,
  }

  getTradingView = () => {
    if (this.TradingView) {
      return this.TradingView
    }

    this.TradingView = window.TradingView
    return this.TradingView
  }

  componentDidMount() {
    // TODO: inject TV lib here
    const { coinObj } = this.props
    const { symbol } = coinObj
    const TradingView = this.getTradingView()

    // Options resource https://github.com/stevenGame/jr-chart/wiki/Widget-Constructor
    // chinese translation of the unavailable git wiki https://zlq4863947.gitbooks.io/tradingview/content/
    this.tvWidget = new TradingView.widget({
      debug: false,
      fullscreen: false,
      symbol,
      interval: '60',
      container_id: containerID,
      datafeed: new Datafeed(
        this.getData,
        this.getHourlyData,
        this.setResetHandler,
      ),
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
        intervals: ['D'],
      },
      timeframe: '1m',
      time_frames: [
        // { text: '1d', resolution: '60', description: '1 Day' },
        // { text: '7d', resolution: '60', description: '7 Days' },
        { text: '1m', resolution: 'D', description: '1 Month' },
        { text: '3m', resolution: 'D', description: '3 Months' },
        { text: '6m', resolution: 'D', description: '6 Months' },
        { text: '1y', resolution: 'D', description: '1 Year' },
        { text: '1000y', resolution: 'D', description: 'All', title: 'All' },
      ],
    })

    this.tvWidget.onChartReady(() => {
      this.setState({ ready: true })
      document.chart = this.tvWidget.chart()
    })
  }

  getData = () => {
    return this.props.priceData
  }

  getHourlyData = () => {
    return this.props.priceDataHourly
      ? this.props.priceDataHourly
      : this.props.priceData
  }

  setResetHandler = (onResetCacheNeededCallback) => {
    this.resetHandler = onResetCacheNeededCallback
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.ready &&
      (!_.isEqual(prevProps.priceData, this.props.priceData) ||
        !_.isEqual(prevProps.priceDataHourly, this.props.priceDataHourly))
    ) {
      try {
        if (this.tvWidget && this.tvWidget.chart && this.resetHandler) {
          const chart = this.tvWidget.chart()
          this.resetHandler() // needs to be called before resetData(); calls onResetCacheNeededCallback()
          chart.resetData() // causes chart to re-request data
        }
      } catch (e) {
        console.error(e)
      }
    }

    if (prevProps.currency !== this.props.currency) {
      // currency change logic here
    }
  }

  render() {
    return <div id={containerID} className={this.props.classes.root} />
  }
}

class TradingViewChartWrapper extends Component {
  _isMounted = false
  script_src = '/tradingview/charting_library.min.js'

  constructor(props) {
    super(props)
    this.state = {
      loading: !this.hasScript(),
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.loadScript()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  hasScript = () => {
    return !!document.querySelector(`script[src="${this.script_src}"]`)
  }

  loadScript = () => {
    // postscribe does not support SSR and needs to guard against being called on server side
    if (typeof window === 'undefined') {
      return
    }
    if (this.hasScript()) {
      if (this.state.loading) {
        this.setState({ loading: false })
      }
      return
    }

    const postscribe = require('postscribe')
    postscribe(
      document.querySelector('head'),
      `<script src="${this.script_src}" defer></script>`,
      {
        done: () => {
          if (!this._isMounted) {
            return
          }
          this.setState({ loading: false })
        },
        error: (e) => {
          console.error(e)
          if (!this._isMounted) {
            return
          }
          this.loadScript()
        },
      },
    )
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />
    }
    return <TradingViewChart {...this.props} />
  }
}

export default withStyles(styles)(TradingViewChartWrapper)
