/*
 * This is a button which holds a label and a value. The filter prop is an
 * Immutable map which provides these. The value should be an Immutable List or
 * Object, or a string
 *
 * onClick just calls toggleUI using the filter's key, causing that filter's
 * component to render.
 */
import React from 'react'
import Immutable from 'immutable'
import FilterComponent from './FilterComponent'

export default props => {
  const { filter, toggleUI, currentUI } = props
  const uiKey = 'editFilter'
  const filterKey = currentUI(uiKey)
  return (
    <div className="oi" key={`filter-${filter.get('key')}`}>
      {currentUI(uiKey) === filter.get('key') && (
        <FilterComponent {...{ ...props, filterKey, uiKey }} />
      )}
      <button
        className="oi-btn"
        onClick={() => toggleUI(uiKey, filter.get('key'))}
      >
        <header>{filter.get('label')}</header>
        <div className="oi-value">
          <FilterButtonLabel {...props} />
        </div>
      </button>
    </div>
  )
}

const FilterButtonLabel = ({ filter }) => {
  const { value } = filter.toObject()
  if (value instanceof Immutable.List) {
    return `${value.size} selected`
  } else if (value instanceof Immutable.Map) {
    return (
      <div className="nh1">
        {value.entrySeq().map(([key, value]) => (
          <span className="mh1" key={key}>
            <span className="ttc mr1">{key}</span>
            <b>{value}</b>
          </span>
        ))}
      </div>
    )
  }
  return value
}
