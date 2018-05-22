import React from 'react'
import Tabs from '../Tabs'
import PriceGraph from './PriceGraph'
import TradingViewChart from './TradingViewChart'

export default (props) => {
  return (
    <div>
      <Tabs
        target="coin-charts"
        items={['News + Price Chart', 'TradingView Chart']}
        className="flex-auto justify-center justify-start-l"
      />
      <div id="coin-charts" className="mt3 nl3 nr3 mh0-m">
        <div className="tab-content active">
          <PriceGraph {...props} />
        </div>
        <div className="tab-content">
          <TradingViewChart {...props} />
        </div>
      </div>
    </div>
  )
}
