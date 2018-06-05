import React from 'react'
import NewsItemList from './NewsItemList'
import BodySection from './BodySection'
import Filters from './Filters'

export default function(props) {
  const { activeEntity, currentUI } = props
  return (
    <div>
      <div className="bg-white">
        <Filters {...props} />
        <NewsItemList {...props} />
      </div>
      {activeEntity &&
        currentUI('newsfeedModal') && (
          <div className="overlay">
            <BodySection {...props} />
          </div>
        )}
    </div>
  )
}
