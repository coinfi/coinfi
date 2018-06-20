import React from 'react'
import { FilterButtonLabel, FilterButtonValue } from './Filters/FilterButton'
import Icon from './Icon'

const FilterTags = (props) => {
  const { removeFilter, activeFilters } = props
  return (
    <div>
      {activeFilters.map((filter, i) => (
        <div key={i} className="tag-alt2">
          {filter.get('value') &&
            filter.get('value').size > 1 && (
              <span className="fw4 mr2">
                <FilterButtonLabel filter={filter} />
              </span>
            )}
          <FilterButtonValue filter={filter} />
          <Icon
            name="times"
            regular
            className="ml2"
            onClick={() => removeFilter(filter.get('key'))}
          />
        </div>
      ))}
    </div>
  )
}

export default FilterTags
