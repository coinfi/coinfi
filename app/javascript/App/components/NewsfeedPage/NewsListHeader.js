import React, { Fragment } from 'react'
import Icon from '../Icon'
import SectionHeader from './SectionHeader'
import FilterPanel from '../FilterPanel'

const NewsListHeader = (props) => {
  const { toggleUI, currentUI, coins, feedSources, activeFilters } = props
  const toggleFilters = () =>
    toggleUI('filters', { toggleBodyScroll: window.isMobile })
  return (
    <Fragment>
      <SectionHeader>
        <div>
          {!window.isDesktop && (
            <button
              className="btn btn-blue btn-xs"
              onClick={() => toggleUI('coinListDrawer')}
            >
              <Icon name="list" className="mr2" />
              Coin list
            </button>
          )}
        </div>
        <div className="flex items-center">
          <span className="aqua fw6 pr2">{activeFilters.size}</span>
          <button onClick={toggleFilters} className="btn btn-xs btn-white">
            <Icon name="filter" className="mr2" />
            Filters
          </button>
        </div>
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
