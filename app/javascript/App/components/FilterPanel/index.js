import React, { Component } from 'react'
import Types from 'prop-types'
import Layout from './Layout'
import FilterComponent from './FilterComponent'
import { normalizeFilterData } from '../../lib/stateHelpers'
import { DateTime } from 'luxon'

class FilterPanel extends Component {
  state = { filters: {} }
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

    if (value.target && value.target.type === 'date') {

      // console.log(DateTime)
      // console.log(date.toString)
      const isoDate = DateTime.fromISO(value.target.value).toString()

      // if (value.target.classList.value === 'from') filters['publishedSince'] = isoDate
      // if (value.target.classList.value === 'to') filters['publishedUntil'] = isoDate
    }

    if (value.toJS) value = value.toJS()
    filters[key] = value
    if (!value.length) delete filters[key]
    console.log(filters)
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
      <Layout {...{ ...props, applyFilters, resetFilters }} newsFeedStyle>
        {filterList.map((filter, index) => {
          // console.log(filter)
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
  setFilters: Types.func.isRequired
}
