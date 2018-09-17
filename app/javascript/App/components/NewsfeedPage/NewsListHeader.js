import React, { Fragment } from 'react'
import SearchCoins from '../SearchCoins'
import FilterPanel from '../FilterPanel'
import FilterBar from '../../bundles/common/components/FilterPanel/FilterBar'
import CoinTipsTab from '../../bundles/common/components/CoinTipsTab'
import withDevice from '~/bundles/common/utils/withDevice'

const NewsListHeader = (props) => {
  const { enableUI, currentUI, coins, feedSources, newsfeedTips } = props

  const toggleFilterPanel = () =>
    enableUI('filterPanel', { fullScreen: props.isMobile })

  const showCoinListDrawer = () =>
    enableUI('coinListDrawer', { fullScreen: true })

  return (
    <Fragment>
      {props.isMobile && (
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

export default withDevice(NewsListHeader)
