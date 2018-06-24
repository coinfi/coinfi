import React from 'react'
import { FilterButtonValue } from './Filters/FilterButton'

const FilterTags = (props) => {
  const { removeFilter, activeFilters } = props
  return (
    <div>
      {activeFilters.map((filter) => (
        <div
          key={filter.get('key')}
          className="coin-filter-tag pa1"
        >
          <FilterButtonValue filter={filter} />
          <a className="ml2 mr1 gray" onClick={() => removeFilter(filter.get('key'))}>
            <i className="icon far fa-times" />
          </a>
        </div>
      ))}
    </div>
  )
}

export default FilterTags
