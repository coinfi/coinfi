import React, { Component } from 'react'
import AddFilter from './AddFilter'
import FilterButton from './FilterButton'
import SearchButton from './SearchButton'

export default class DesktopLayout extends Component {
  render() {
    const { activeFilters } = this.props
    return (
      <div className="flex-stack items-start">
        {!activeFilters.find(f => f.get('key') === 'search') && (
          <div>
            <SearchButton {...this.props} />
          </div>
        )}
        {activeFilters.map((filter, i) => (
          <div key={i}>
            <FilterButton filter={filter} {...this.props} />
          </div>
        ))}
        <div>
          <AddFilter {...this.props} />
        </div>
      </div>
    )
  }
}
