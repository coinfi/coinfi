import React, { Fragment } from 'react'
import Types from 'prop-types'
import components from './filterComponents'

const FilterComponent = (props) => {
  const { filter } = props
  const key = filter.get('key')
  const label = filter.get('label')
  const Component = components[key]
  if (!Component) {
    return null
  }
  return (
    <div className="pb3">
      <h4 className="mb2 f5">{label}</h4>
      <Component {...props} />
    </div>
  )
}

export default FilterComponent

FilterComponent.propTypes = {
  activeFilters: Types.object.isRequired,
  filter: Types.object.isRequired,
  setFilter: Types.func.isRequired,
  removeFilter: Types.func.isRequired,
}
