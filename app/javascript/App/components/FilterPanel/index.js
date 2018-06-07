import React, { Component } from 'react'
import Types from 'prop-types'
import Layout from './Layout'
import FilterComponent from './FilterComponent'
import { normalizeFilterData } from '../../lib/stateHelpers'

class AltFilters extends Component {
  state = {}
  componentWillMount() {
    this.props.activeFilters.forEach((filter) => {
      this.onChange(filter.get('key'))(filter.get('value'))
    })
  }
  onChange = (key) => (value) => {
    const s = {}
    if (value.toJS) value = value.toJS()
    s[key] = value
    this.setState(s)
  }
  applyFilters = () => {
    const { setFilters, onChange } = this.props
    setFilters(this.state)
    if (onChange) onChange()
  }
  render() {
    const { filterList, filterData, ...props } = this.props
    const pProps = { ...props, filterData: normalizeFilterData(filterData) }
    return (
      <Layout applyFilters={this.applyFilters} {...props}>
        {filterList.map((filter, index) => {
          return (
            <FilterComponent
              key={index}
              {...pProps}
              filter={filter}
              onChange={this.onChange}
              value={this.state[filter.get('key')]}
            />
          )
        })}
      </Layout>
    )
  }
}

export default AltFilters

AltFilters.propTypes = {
  activeFilters: Types.object.isRequired,
  setFilters: Types.func.isRequired
}
