/*
 * This will attempt to render a filter component based on the provided
 * "filterKey" prop, as well as pass its state (value) to it if present.
 */
import React from 'react'
import enhanceWithClickOutside from 'react-click-outside'
import components from './filterComponents'

class FilterComponent extends React.Component {
  handleClickOutside() {
    const { currentUI, toggleUI } = this.props
    if (currentUI('newFilter')) toggleUI('newFilter')
    if (currentUI('editFilter')) toggleUI('editFilter')
  }
  render() {
    const { uiKey, currentUI, activeFilters } = this.props
    const filterKey = currentUI(uiKey)
    const Component = components[filterKey]
    const activeFilter = activeFilters.find(o => o.get('key') === filterKey)
    const value = activeFilter ? activeFilter.get('value') : null
    if (!Component) return null
    return (
      <div className="oi-pane">
        <div className="oi-pane-content">
          <Component {...this.props} value={value} />
        </div>
      </div>
    )
  }
}

export default enhanceWithClickOutside(FilterComponent)
