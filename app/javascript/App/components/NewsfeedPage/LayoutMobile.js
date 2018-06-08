import React from 'react'
import NewsItemList from './NewsItemList'
import BodySection from './BodySection'
import ActionBar from './ActionBar'

export default function(props) {
  const { activeEntity, currentUI } = props
  return (
    <div className="relative flex-auto bg-white">
      <ActionBar {...props} />
      <NewsItemList {...props} />
      {activeEntity &&
        currentUI('newsfeedModal') && (
          <div className="overlay">
            <BodySection {...props} />
          </div>
        )}
    </div>
  )
}
