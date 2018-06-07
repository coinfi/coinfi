import React from 'react'
import NewsItemList from './NewsItemList'
import BodySection from './BodySection'
import ActionBar from './ActionBar'

export default function(props) {
  const { activeEntity, currentUI } = props
  return (
    <div>
      <div className="bg-white">
        <ActionBar {...props} />
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
