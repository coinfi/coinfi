import React from 'react'
import Types from 'prop-types'
import components from './filterComponents'

const FilterComponent = (props) => {
  const { filter } = props
  const Component = components[filter.get('key')]
  if (!Component) {
    console.error(`Component not found for "${filter.get('key')}"`)
    return null
  }
  return (
    <div className="pv4 bb b--geyser">
      <h4 className="mb2">{filter.get('label')}</h4>
      <Component {...props} />
    </div>
  )
}

export default FilterComponent

FilterComponent.propTypes = {
  activeFilters: Types.object.isRequired,
  filter: Types.object.isRequired,
  setFilter: Types.func.isRequired,
  removeFilter: Types.func.isRequired
}
