import React from 'react'
import { FilterButtonLabel, FilterButtonValue } from './Filters/FilterButton'
import Icon from './Icon'

const FilterTags = (props) => {
  const { removeFilter, activeFilters } = props
  return (
    <div>
      {activeFilters.map((filter, i) => (
        <button
          key={i}
          className="tag-alt2"
          onClick={() => removeFilter(filter.get('key'))}
        >
          <FilterButtonLabel filter={filter} />
          <span className="ml2 aqua">
            <FilterButtonValue filter={filter} />
          </span>
          <Icon name="times" regular className="ml2" />
        </button>
      ))}
    </div>
  )
}

export default FilterTags
