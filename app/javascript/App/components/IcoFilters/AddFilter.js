/*
 * A simple button to toggle some UI: { newFilter: selectFilter }
 *
 * SelectFilter is then rendered via FilterComponent, which then toggles (for
 * example) { newFilter: categories }
 */
import React from 'react'
import FilterComponent from './FilterComponent'
import Icon from '../Icon'

export default props => {
  const { currentUI, toggleUI, filterList } = props
  const uiKey = 'newFilter'
  const filterKey = currentUI(uiKey)
  let filter = null
  if (filterKey && filterKey !== 'selectFilter')
    filter = filterList.find(o => o.get('key') === filterKey)
  return (
    <div className="oi">
      {filterKey ? (
        <FilterComponent {...{ ...props, filterKey, filter, uiKey }} />
      ) : (
        <button
          className="oi-icon"
          onClick={() => toggleUI('newFilter', 'selectFilter')}
        >
          <Icon name="plus" />
        </button>
      )}
    </div>
  )
}
