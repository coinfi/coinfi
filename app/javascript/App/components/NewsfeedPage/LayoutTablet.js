import React from 'react'
import NewsItemList from './NewsItemList'
import NewsItemBody from './NewsItemBody'
import CoinBody from './CoinBody'
import Tips from './Tips'
import Filters from './Filters'

export default function(props) {
  const { activeEntity } = props
  return (
    <div className="bg-white flex flex-column flex-auto">
      <div className="row no-gutter flex-auto">
        <div className="col-xs-6 bl b--light-gray relative">
          <Filters {...props} />
          <NewsItemList {...props} />
        </div>
        <div className="col-xs-6 bl b--light-gray relative">
          {activeEntity ? (
            <div>
              {activeEntity.type === 'coin' ? (
                <CoinBody {...props} />
              ) : (
                <NewsItemBody {...props} />
              )}
            </div>
          ) : (
            <Tips />
          )}
        </div>
      </div>
    </div>
  )
}
