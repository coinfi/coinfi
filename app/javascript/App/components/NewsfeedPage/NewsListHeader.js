import React, { Fragment } from 'react'
import SearchCoins from '../SearchCoins'
import FilterPanel from '../FilterPanel'
import FilterTags from '../FilterTags'
import FilterBar from '../../bundles/common/components/FilterPanel/FilterBar'
import CoinTipsTab from '../../bundles/common/components/CoinTipsTab'

const NewsListHeader = (props) => {
  const {
    enableUI,
    currentUI,
    coins,
    feedSources,
    activeFilters,
    newsfeedTips,
  } = props

  const toggleFilters = () =>
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
      <FilterBar {...props} toggleFilterPanel={toggleFilters}>
        <SearchCoins {...props} />
      </FilterBar>
      {activeFilters.size > 0 && (
        <div className="pa3 f6 b--b bg-athens flex items-center">
          <span className="mr2">Viewing by:</span>
          <FilterTags {...props} toggleFilterPanel={toggleFilters} />
        </div>
      )}
      {currentUI('filterPanel') && (
        <FilterPanel {...props} filterData={{ coins, feedSources }} />
      )}
    </Fragment>
  )
}

export default NewsListHeader
