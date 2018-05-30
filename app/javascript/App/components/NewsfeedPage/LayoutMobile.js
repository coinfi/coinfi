import React from 'react'
import CoinList from './CoinList'
import NewsItemList from './NewsItemList'
import NewsItemBody from './NewsItemBody'
import CoinBody from './CoinBody'
import Tips from './Tips'
import PageHeader from './PageHeader'

export default function(props) {
  const { activeEntity, currentUI, toggleUI } = props
  return (
    <div>
      <PageHeader {...props} />
      <button
        className="btn btn-blue btn-sm"
        onClick={() => toggleUI('coinDrawer')}
      >
        Coin list
      </button>
      <div className="bg-white">
        <NewsItemList {...props} />
      </div>
      {currentUI('coinDrawer') && (
        <div className="drawer">
          <CoinList {...props} />
        </div>
      )}
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
