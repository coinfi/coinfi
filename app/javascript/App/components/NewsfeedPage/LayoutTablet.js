import React, { Fragment } from 'react'
import NewsList from './NewsList'
import CoinListDrawer from './CoinListDrawer'
import NewsListHeader from './NewsListHeader'
import BodySection from './BodySection'

export default function(props) {
  return (
    <Fragment>
      <div className="bg-white flex flex-column flex-auto">
        <div className="row no-gutter flex-auto">
          <div className="col-xs-6 b--l relative flex flex-column">
            <NewsListHeader {...props} />
            <NewsList {...props} />
          </div>
          <div className="col-xs-6 b--l relative overflow-y-auto">
            <BodySection {...props} />
          </div>
        </div>
      </div>
      <CoinListDrawer {...props} />
    </Fragment>
  )
}
