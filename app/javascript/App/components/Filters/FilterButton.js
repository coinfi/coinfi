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
import { singularize } from '../../lib/misc'
import _ from 'lodash'

const FilterButton = (props) => {
  const { filter, toggleUI, currentUI, removeFilter } = props
  const uiKey = 'editFilter'
  return (
    <div className="oi">
      {currentUI(uiKey) === filter.get('key') && (
        <FilterComponent {...{ ...props, uiKey }} />
      )}
      <div
        className="oi-btn"
        onClick={() => toggleUI([uiKey, filter.get('key')])}
      >
        <header>
          <FilterButtonLabel {...props} />
        </header>
        <div className="oi-value">
          <FilterButtonValue {...props} />
        </div>
        <div className="oi-meta">
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

export const FilterButtonLabel = ({ filter }) => {
  const { value, label } = filter.toObject()
  if (!label) return ''
  if (value instanceof Immutable.List)
    if (value.size === 1) return singularize(label)
  return label || ''
}

export const FilterButtonValue = ({ filter }) => {
  const { value, key } = filter.toObject()
  const Component = buttonLabels[key]
  if (Component) return <Component value={value} />
  if (value instanceof Immutable.List) {
    if (value.size >= 2 || value.size === 0) {
      return `${_.startCase(key)} (${value.size})`
    } else {
      let val = value.get('0')
      if (val instanceof Object) {
        if (val.toJS) val = val.toJS()
        return val.title || val.name || val.label
      }
      return val
    }
  }
  if ([true, false].includes(value)) return value ? 'True' : 'False'
  return value
}

export default FilterButton
