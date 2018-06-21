import React from 'react'
import { FilterButtonValue } from './Filters/FilterButton'
import Icon from './Icon'

const FilterTags = (props) => {
  const { removeFilter, activeFilters } = props
  return (
    <div>
      {activeFilters.map((filter, i) => (
        <div
          key={i}
          className="tag-alt2 pa2"
        >
          <span className="ml2">
            <FilterButtonValue filter={filter} />
          </span>
          <Icon
            name="times"
            regular
            className="ml2 pa2-ns"
            onClick={() => removeFilter(filter.get('key'))}
          />
        </div>
      ))}
    </div>
  )
}

export default FilterTags
