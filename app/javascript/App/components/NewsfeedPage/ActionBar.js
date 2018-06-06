import React, { Fragment } from 'react'
import Icon from '../Icon'
import CoinDrawer from './CoinDrawer'
import FilterPanel from '../FilterPanel'

const ActionBar = (props) => {
  const { toggleUI, currentUI, coins, feedSources, activeFilters } = props
  return (
    <Fragment>
      <div className="pa3 bb b--athens-dark flex justify-between items-center">
        <div>
          <CoinDrawer {...props} />
        </div>
        <div className="flex items-center">
          <span className="aqua fw6 pr2">{activeFilters.size}</span>
          <button
            onClick={() => toggleUI('filters')}
            className="btn btn-xs btn-white"
          >
            <Icon name="filter" className="mr2" />
            Filters
          </button>
        </div>
      </div>
      {currentUI('filters') && (
        <FilterPanel
          {...props}
          filterData={{ coins, feedSources }}
          onChange={() => toggleUI('filters')}
        />
      )}
    </Fragment>
  )
}

export default ActionBar
