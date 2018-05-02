import React, { Component } from 'react'
import AddFilter from './AddFilter'
import FilterButton from './FilterButton'
import Icon from '../Icon'

export default class MobileLayout extends Component {
  toggleFilters = () => {
    const { toggleUI, activeFilters } = this.props
    toggleUI('mobileFilters')
    if (activeFilters.size === 0) toggleUI('newFilter', 'selectFilter')
  }
  render() {
    const { activeFilters, currentUI } = this.props
    return (
      <div>
        {!currentUI('mobileFilters') ? (
          <button
            onClick={this.toggleFilters}
            className="box-style-1 elephant body-font w-100 flex items-center justify-center pa3"
          >
            <div>{`${activeFilters.size} filters applied`}</div>
            <Icon name="angle-down" className="ml3" />
          </button>
        ) : (
          <div>
            {activeFilters.map((filter, i) => (
              <FilterButton key={i} filter={filter} {...this.props} />
            ))}
            <div className="mt3 flex justify-between items-end">
              <button onClick={this.toggleFilters} className="btn btn-sm">
                Cancel
              </button>
              <AddFilter {...this.props} />
              <button onClick={this.toggleFilters} className="btn btn-sm">
                Finish
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}
