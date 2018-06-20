import React, { Fragment } from 'react'
import Icon from '../Icon'
import SectionHeader from './SectionHeader'
import SearchCoins from './SearchCoins'
import FilterPanel from '../FilterPanel'
import FilterTags from '../FilterTags'

const NewsListHeader = (props) => {
  const { enableUI, currentUI, coins, feedSources, activeFilters } = props
  const toggleFilters = () =>
    enableUI('filterPanel', { fullScreen: window.isMobile })
  return (
    <Fragment>
      <SectionHeader>
        <div>
          {!window.isDesktop && (
            <button
              className="btn btn-blue btn-xs"
              onClick={() => enableUI('coinListDrawer', { fullScreen: true })}
            >
              <Icon name="list" className="mr2" />
              Coin list
            </button>
          )}
          <SearchCoins {...props} />
        </div>
        <div className="flex items-center">
          <button onClick={toggleFilters} className="btn btn-xs btn-white">
            <Icon name="filter" className="mr2" />
            Filters
          </button>
        </div>
      </SectionHeader>
      {activeFilters.size > 0 && (
        <div className="pa3 b--b bg-athens">
          <div className="f6 mb1" style={{ lineHeight: 1.33 }}>
            Currently viewing by:
          </div>
          <FilterTags {...props} />
        </div>
      )}
      {currentUI('filterPanel') && (
        <FilterPanel {...props} filterData={{ coins, feedSources }} />
      )}
    </Fragment>
  )
}

export default NewsListHeader
