import React from 'react'
import CoinList from './CoinList'
import NewsList from './NewsList'
import NewsListHeader from './NewsListHeader'
import BodySection from './BodySection'

export default function(props) {
  return (
    <div className="flex flex-column flex-auto">
      <div className="row no-gutter flex-auto bg-white">
        <div className="col-xs-2 relative flex flex-column b--l">
          <CoinList {...props} />
        </div>
        <div className="col-xs-5 relative flex flex-column b--l">
          <NewsListHeader {...props} />
          <NewsList {...props} />
        </div>
        <div className="col-xs-5 relative overflow-y-auto b--l b--r">
          <BodySection {...props} />
        </div>
      </div>
    </div>
  )
}
