import React, { Component } from 'react'
import Types from 'prop-types'
import Layout from './Layout'
import FilterComponent from './FilterComponent'
import { normalizeFilterData } from '../../lib/stateHelpers'

class FilterPanel extends Component {
  state = { filters: {} }
  componentWillMount() {
    this.props.activeFilters.forEach((filter) => {
      this.onChange(filter.get('key'))(filter.get('value'))
    })
  }
  onChange = (key) => (value) => {
    const filters = { ...this.state.filters }
    if (value.toJS) value = value.toJS()
    filters[key] = value
    this.setState({ filters })
  }
  applyFilters = () => {
    const { setFilters, disableUI } = this.props
    setFilters(this.state.filters)
    disableUI('filterPanel')
  }
  resetFilters = () => {
    this.setState({ filters: {} })
  }
  render() {
    const { filterList, filterData, ...props } = this.props
    const pProps = { ...props, filterData: normalizeFilterData(filterData) }
    const { applyFilters, resetFilters } = this
    return (
      <Layout {...{ ...props, applyFilters, resetFilters }}>
        {filterList.map((filter, index) => {
          if (filter.get('key') === 'coins') return null // Temp fix for hiding coins
          return (
            <FilterComponent
              key={index}
              {...pProps}
              filter={filter}
              onChange={this.onChange}
              value={this.state.filters[filter.get('key')]}
            />
          )
        })}
      </Layout>
    )
  }
}

export default FilterPanel

FilterPanel.propTypes = {
  activeFilters: Types.object.isRequired,
  setFilters: Types.func.isRequired
}
