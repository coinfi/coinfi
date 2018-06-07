import React from 'react'
import NewsList from './NewsList'
import BodySection from './BodySection'
import NewsListHeader from './NewsListHeader'

export default function(props) {
  const { activeEntity, currentUI } = props
  return (
    <div>
      <div className="bg-white">
        <NewsListHeader {...props} />
        <NewsList {...props} />
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
