import React, { Component } from 'react'
import Types from 'prop-types'
import Layout from './Layout'
import FilterComponent from './FilterComponent'
import { normalizeFilterData } from '../../lib/stateHelpers'
import nightModeHelper from '~/nightModeHelper'

class FilterPanel extends Component {
  state = { filters: this.props.defaultFilters || {} }
  componentDidMount() {
    const filters = { ...this.state.filters }
    this.props.activeFilters.forEach((value) => {
      if (value.toJS) value = value.toJS()
      filters[value.key] = value.value
      this.setState({ filters })
    })
  }
  onChange = (key, event) => (value) => {
    const filters = { ...this.state.filters }
    if (value.toJS) value = value.toJS()
    filters[key] = value
    if (value && value.publishedSince) {
      filters[key] = value.publishedSince
    }
    if (value && value.publishedUntil) {
      filters[key] = value.publishedUntil
    }

    if (!value.length) delete filters[key]
    this.setState({ filters })
  }
  applyFilters = () => {
    const { setFilters, disableUI } = this.props
    setFilters(this.state.filters)
    disableUI('filterPanel')
    nightModeHelper()
  }
  resetFilters = () => {
    this.setState({ filters: this.props.defaultFilters || {} })
  }
  render() {
    const { filterList, filterData, ...props } = this.props
    const pProps = { ...props, filterData: normalizeFilterData(filterData) }
    const { applyFilters, resetFilters } = this
    return (
      <Layout {...{ ...props, applyFilters, resetFilters }} newsFeedStyle>
        {filterList.map((filter, index) => {
          if (filter.get('key') === 'coins') return null // Temp fix for hiding coins
          if (filter.get('key') === 'keywords') return null
          return (
            <FilterComponent
              key={index}
              {...pProps}
              filter={filter}
              onChange={this.onChange}
              value={this.state.filters}
              newsFeedStyle
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
  setFilters: Types.func.isRequired,
}
