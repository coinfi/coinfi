import React from 'react'
import { FilterButtonValue } from './Filters/FilterButton'

const FilterTags = (props) => {
  const { removeFilter, activeFilters } = props
  let tagLabel = ''
  return (
    <div>
      {activeFilters.map((filter) => {
        if (filter.get('key') === 'publishedSince') tagLabel = 'from'
        if (filter.get('key') === 'publishedUntil') tagLabel = 'to'
        if (filter.get('key') !== 'publishedUntil' && filter.get('key') !== 'publishedSince') tagLabel = ''
        return (
        <div
          key={filter.get('key')}
          className="coin-filter-tag pa1"
        >
          {tagLabel} <FilterButtonValue filter={filter} />
          {/* <a className="ml2 mr1 gray" onClick={ */}
          {/*   () => removeFilter(filter.get('key')) */}
          {/*   console.log('show pane') */}
          {/* }> */}
          {/*   <i className="icon far fa-times" /> */}
          {/* </a> */}
        </div>
        )
      }

      )}
    </div>
  )
}

export default FilterTags
