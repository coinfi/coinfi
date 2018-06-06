import React from 'react'
import NewsItemList from './NewsItemList'
import ActionBar from './ActionBar'
import BodySection from './BodySection'

export default function(props) {
  return (
    <div className="bg-white flex flex-column flex-auto">
      <div className="row no-gutter flex-auto">
        <div className="col-xs-6 bl b--light-gray relative">
          <ActionBar {...props} />
          <NewsItemList {...props} />
        </div>
        <div className="col-xs-6 bl b--light-gray relative">
          <BodySection {...props} />
        </div>
      </div>
    </div>
  )
}
