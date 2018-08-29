import React, { Fragment } from 'react'
import SearchCoins from '../SearchCoins'
import FilterPanel from '../FilterPanel'
import FilterBar from '../../bundles/common/components/FilterPanel/FilterBar'
import CoinTipsTab from '../../bundles/common/components/CoinTipsTab'

const NewsListHeader = (props) => {
  const { enableUI, currentUI, coins, feedSources, newsfeedTips } = props

  const toggleFilterPanel = () =>
    enableUI('filterPanel', { fullScreen: window.isMobile })

  const showCoinListDrawer = () =>
    enableUI('coinListDrawer', { fullScreen: true })

  return (
    <Fragment>
      {window.isMobile && (
        <CoinTipsTab
          showCoinListDrawer={showCoinListDrawer}
          showTips={newsfeedTips}
        />
      )}
      <FilterBar
        toggleFilterPanel={toggleFilterPanel}
        showCoinListDrawer={showCoinListDrawer}
      >
        <SearchCoins {...props} />
      </FilterBar>
      {currentUI('filterPanel') && (
        <FilterPanel {...props} filterData={{ coins, feedSources }} />
      )}
    </Fragment>
  )
}

export default NewsListHeader
