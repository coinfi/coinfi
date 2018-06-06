import React from 'react'
import CoinList from './CoinList'
import NewsItemList from './NewsItemList'
import ActionBar from './ActionBar'
import BodySection from './BodySection'

export default function(props) {
  return (
    <div className="flex flex-column flex-auto">
      <div className="container-wide ph4-l flex-auto flex flex-column">
        <div className="row no-gutter flex-auto bg-white">
          <div className="col-xs-2 relative overflow-y-auto">
            <CoinList {...props} />
          </div>
          <div className="col-xs-5 relative flex flex-column bl b--light-gray">
            <ActionBar {...props} />
            <NewsItemList {...props} />
          </div>
          <div className="col-xs-5 relative overflow-y-auto bl b--light-gray">
            <BodySection {...props} />
          </div>
        </div>
      </div>
    </div>
  )
}
