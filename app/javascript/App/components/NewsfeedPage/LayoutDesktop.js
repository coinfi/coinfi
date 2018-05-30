import React from 'react'
import CoinList from './CoinList'
import NewsItemList from './NewsItemList'
import NewsItemBody from './NewsItemBody'
import CoinBody from './CoinBody'
import Tips from './Tips'
import PageHeader from './PageHeader'

export default function(props) {
  const { activeEntity } = props
  return (
    <div>
      <PageHeader {...props} />
      <div className="container-wide ph4-l">
        <div className="bg-white">
          <div className="row no-gutter flex">
            <div className="col-xs-2">
              <CoinList {...props} />
            </div>
            <div className="col-xs-5 bl b--light-gray">
              <NewsItemList {...props} />
            </div>
            <div className="col-xs-5 bl b--light-gray">
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
      </div>
    </div>
  )
}
