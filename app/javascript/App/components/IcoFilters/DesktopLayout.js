import React, { Component } from 'react'
import AddFilter from './AddFilter'
import FilterButton from './FilterButton'
import Icon from '../Icon'

export default class DesktopLayout extends Component {
  render() {
    const { activeFilters } = this.props
    return (
      <div className="flex-stack items-start">
        <div>
          <button className="oi-icon">
            <Icon name="search" />
          </button>
        </div>
        {activeFilters.map((filter, i) => (
          <div key={i}>
            <FilterButton filter={filter} {...this.props} />
          </div>
        ))}
        <div>
          <div className="oi">
            <AddFilter {...this.props} />
          </div>
        </div>
      </div>
    )
  }
}
