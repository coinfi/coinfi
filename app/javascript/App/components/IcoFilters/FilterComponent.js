/*
 * This will attempt to render a filter component
 * based on the provided "filterKey" prop, as well
 * as pass its state (value) to it if present.
 */
import React from 'react'
import enhanceWithClickOutside from 'react-click-outside'
import components from './filterComponents'

class FilterComponent extends React.Component {
  handleClickOutside() {
    const { showing, toggleUI } = this.props
    if (showing('newFilter')) toggleUI('newFilter')
    if (showing('editFilter')) toggleUI('editFilter')
  }
  render() {
    const { filterKey, activeFilters } = this.props
    const Component = components[filterKey]
    const activeFilter = activeFilters.find(o => o.get('key') === filterKey)
    const value = activeFilter ? activeFilter.get('value') : null
    return (
      <div className="oi-pane">
        <div className="oi-pane-content pa3">
          <Component {...this.props} value={value} />
        </div>
      </div>
    )
  }
}

export default enhanceWithClickOutside(FilterComponent)
