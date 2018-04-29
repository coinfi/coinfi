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
import Icon from '../Icon'
import FilterComponent from './FilterComponent'
import buttonLabels from './filterButtonLabels'

export default props => {
  const { filter, toggleUI, currentUI, removeFilter } = props
  const uiKey = 'editFilter'
  return (
    <div className="oi">
      {currentUI(uiKey) === filter.get('key') && (
        <FilterComponent {...{ ...props, uiKey }} />
      )}
      <div
        className="oi-btn"
        onClick={() => toggleUI(uiKey, filter.get('key'))}
      >
        <header>{filter.get('label')}</header>
        <div className="oi-value">
          <FilterButtonLabel {...props} />
        </div>
        <div className="dn-m">
          <Icon
            className="slate"
            name="trash"
            onClick={() => removeFilter(filter.get('key'))}
          />
        </div>
      </div>
    </div>
  )
}

const FilterButtonLabel = ({ filter }) => {
  const { value, key } = filter.toObject()
  const Component = buttonLabels[key]
  if (Component) return <Component value={value} />
  if (value instanceof Immutable.List) return `${value.size} selected`
  if ([true, false].includes(value)) return value ? 'True' : 'False'
  return value
}
