/*
 * A simple button to toggle some UI: { newFilter: selectFilter }
 *
 * SelectFilter is then rendered via FilterComponent, which then toggles (for
 * example) { newFilter: categories }
 */
import React from 'react'
import SelectFilter from './SelectFilter'
import FilterComponent from './FilterComponent'
import Icon from '../Icon'

const AddFilters = (props) => {
  const { currentUI, toggleUI, availableFilters, activeFilters } = props
  if (availableFilters.size === 0) return null
  const uiKey = 'newFilter'
  const filterKey = currentUI(uiKey)
  const toggleNew = () => toggleUI(['newFilter', 'selectFilter'])
  if (!filterKey) {
    if (activeFilters.size > 0 || window.isMobile) {
      return (
        <div className="oi">
          <button className="btn-reset oi-icon" onClick={toggleNew}>
            <Icon name="plus" />
          </button>
        </div>
      )
    } else {
      return (
        <div className="oi">
          <div className="oi-btn" onClick={toggleNew}>
            <header>Filters</header>
            <div className="oi-value">None selected</div>
          </div>
        </div>
      )
    }
  } else if (filterKey === 'selectFilter') {
    return (
      <div className="oi">
        <SelectFilter {...{ ...props, uiKey }} />
      </div>
    )
  } else {
    const filter = availableFilters.find((o) => o.get('key') === filterKey)
    return (
      <div className="oi">
        <FilterComponent {...{ ...props, filter, uiKey }} />
      </div>
    )
  }
}

export default AddFilters
