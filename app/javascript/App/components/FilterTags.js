import React from 'react'
import { FilterButtonLabel, FilterButtonValue } from './Filters/FilterButton'
import Icon from './Icon'

const FilterTags = (props) => {
  const { activeFilters } = props
  return (
    <div>
      {activeFilters.map((filter, i) => (
        <button key={i} className="tag-alt">
          <FilterButtonLabel filter={filter} />
          <FilterButtonValue filter={filter} />
          <Icon name="times" regular className="ml1" />
        </button>
      ))}
    </div>
  )
}

export default FilterTags
