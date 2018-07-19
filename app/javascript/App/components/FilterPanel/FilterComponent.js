import React, {Fragment} from 'react'
import Types from 'prop-types'
import components from './filterComponents'
import MarketMoving from './filterComponents/MarketMoving'
import Categories from './filterComponents/Categories'
import Dates from './filterComponents/Dates'
import FeedSources from './filterComponents/FeedSources'

const FilterComponent = props => {
  const {filter} = props
  const Component = components[filter.get('key')]
  if (!Component) {
    return null
  }
  return (
    <Fragment>
      <div className="pb3">
        <h4 className="mb2 f5">Market Moving</h4>
        <MarketMoving {...props} />
      </div>
      <div className="pv3">
        <h4 className="mv2 f5">Date Range</h4>
        <Dates {...props} />
      </div>
      <div className="pv3">
        <h4 className="mv2 f5">Categories</h4>
        <Categories {...props} />
      </div>
      <div className="pv3">
        <h4 className="mv2 f5">Sources</h4>
        <FeedSources {...props} />
      </div>
    </Fragment>
  )
}

export default FilterComponent

FilterComponent.propTypes = {
  activeFilters: Types.object.isRequired,
  filter: Types.object.isRequired,
  setFilter: Types.func.isRequired,
  removeFilter: Types.func.isRequired,
}
