import React from 'react'
import NewsItemList from './NewsItemList'
import NewsItemBody from './NewsItemBody'
import CoinBody from './CoinBody'
import Filters from './Filters'

export default function(props) {
  const { activeEntity, currentUI, toggleUI } = props
  return (
    <div>
      <div className="bg-white">
        <Filters {...props} />
        <NewsItemList {...props} />
      </div>
      {activeEntity &&
        currentUI('newsfeedModal') && (
          <div className="overlay">
            {activeEntity.type === 'coin' ? (
              <CoinBody {...props} />
            ) : (
              <NewsItemBody {...props} />
            )}
          </div>
        )}
    </div>
  )
}
