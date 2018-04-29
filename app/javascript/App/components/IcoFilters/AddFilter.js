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

const AddFilters = props => {
  const { currentUI, toggleUI, inactiveFilters } = props
  const uiKey = 'newFilter'
  const filterKey = currentUI(uiKey)
  if (!filterKey) {
    return (
      <button
        className="oi-icon"
        onClick={() => toggleUI('newFilter', 'selectFilter')}
      >
        <Icon name="plus" />
      </button>
    )
  } else if (filterKey === 'selectFilter') {
    return <SelectFilter {...{ ...props, uiKey }} />
  } else {
    const filter = inactiveFilters.find(o => o.get('key') === filterKey)
    return <FilterComponent {...{ ...props, filter, uiKey }} />
  }
}

export default props => (
  <div className="oi">
    <AddFilters {...props} />
  </div>
)
