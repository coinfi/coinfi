import React, { Fragment } from 'react'
import Icon from '../Icon'
import CoinDrawer from './CoinDrawer'
import SectionHeader from './SectionHeader'
import FilterPanel from '../FilterPanel'
import FilterTags from '../FilterTags'

const NewsListHeader = (props) => {
  const { toggleUI, currentUI, coins, feedSources, activeFilters } = props
  const toggleFilters = () =>
    toggleUI('filters', { toggleBodyScroll: window.isMobile })
  return (
    <Fragment>
      <SectionHeader>
        <div>
          <CoinDrawer {...props} />
        </div>
        <div className="flex items-center">
          <span className="aqua fw6 pr2">{activeFilters.size}</span>
          <button onClick={toggleFilters} className="btn btn-xs btn-white">
            <Icon name="filter" className="mr2" />
            Filters
          </button>
        </div>
      </SectionHeader>
      <SectionHeader>
        <div>
          <FilterTags {...props} />
        </div>
        <div />
      </SectionHeader>
      {currentUI('filters') && (
        <FilterPanel
          {...props}
          filterData={{ coins, feedSources }}
          onChange={toggleFilters}
        />
      )}
    </Fragment>
  )
}

export default NewsListHeader
