/*
 * This is a button which holds a label and a value.
 * The filter prop is an Immutable map which provides
 * these. The value should be an Immutable List or 
 * Object, or a string
 * 
 * onClick just calls toggleUI using the filter's key,
 * causing that filter's component to render.
 */
import React, { Component, Fragment } from 'react'
import Immutable from 'immutable'
import FilterComponent from './FilterComponent'

export default class FilterButton extends Component {
  render() {
    const { filter, toggleUI, showing } = this.props
    const { label, value, key } = filter.toObject()
    let valueLabel
    const isObject = value instanceof Immutable.Map
    const isList = value instanceof Immutable.List
    if (isObject) {
      valueLabel = (
        <div className="nh1">
          {value.entrySeq().map(([key, value]) => (
            <span className="mh1" key={key}>
              <span className="ttc mr1">{key}</span>
              <b>{value}</b>
            </span>
          ))}
        </div>
      )
    } else if (isList) {
      valueLabel = `${value.size} selected`
    } else {
      valueLabel = value
    }
    return (
      <div className="oi" key={`filter-${filter.get('key')}`}>
        {showing('editFilter') ? (
          <FilterComponent filterKey={showing('editFilter')} {...this.props} />
        ) : (
          <button
            className="oi-btn"
            onClick={() => {
              toggleUI('editFilter', key)
            }}
          >
            <label>{filter.get('label')}</label>
            {valueLabel}
          </button>
        )}
      </div>
    )
  }
}
