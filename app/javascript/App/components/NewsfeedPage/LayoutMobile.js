import React, { Fragment } from 'react'
import NewsList from './NewsList'
import BodySection from './BodySection'
import NewsListHeader from './NewsListHeader'
import CoinListDrawer from './CoinListDrawer'
import BodySectionDrawer from './BodySectionDrawer'

export default function(props) {
  const { activeEntity, currentUI } = props
  return (
    <Fragment>
      <div className="flex-auto flex flex-column">
        <div className="bg-white relative flex-auto">
          <NewsListHeader {...props} />
          <NewsList {...props} />
        </div>
        {activeEntity &&
          currentUI('newsfeedModal') && (
            <Fragment>
              <div className="modal bg-black-70 pt5 vw100">
                <BodySection {...props} mobileLayout />
              </div>
              <div />
            </Fragment>
          )}
      </div>
      <CoinListDrawer {...props} />
      <BodySectionDrawer {...props} />
    </Fragment>
  )
}
