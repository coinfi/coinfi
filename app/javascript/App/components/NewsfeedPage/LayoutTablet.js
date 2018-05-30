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
        <div className="row no-gutter flex">
          <div className="col-xs-6 bl b--light-gray">
            <NewsItemList {...props} />
          </div>
          <div className="col-xs-6 bl b--light-gray">
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
      {currentUI('coinDrawer') && (
        <div className="drawer">
          <CoinList {...props} />
        </div>
      )}
    </div>
  )
}
