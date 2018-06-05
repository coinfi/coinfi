import React, { Component, Fragment } from 'react'
import AddFilter from './AddFilter'
import FilterButton from './FilterButton'
import Icon from '../Icon'

export default class PanelLayout extends Component {
  toggleFilters = () => {
    const { toggleUI } = this.props
    toggleUI('filterPanel')
  }
  render() {
    const { activeFilters, currentUI } = this.props
    const isOpen = currentUI('filterPanel')
    return (
      <Fragment>
        <button onClick={this.toggleFilters} className="btn btn-xs btn-white">
          <Icon name="filter" className="mr2" />
          Filters
        </button>
        {isOpen && (
          <div className="overlay z-2 bg-athens oi-mobile oi-panel overflow-y-auto">
            <div className="pa3 bb b--athens-dark flex justify-between items-center">
              <div className="fw6">Filters</div>
              <Icon
                name="times"
                solid
                className="slate"
                onClick={this.toggleFilters}
              >
                Cancel
              </Icon>
            </div>
            <div className="pa3">
              {activeFilters.map((filter, i) => (
                <FilterButton key={i} filter={filter} {...this.props} />
              ))}
            </div>
            <AddFilter {...this.props} />
          </div>
        )}
      </Fragment>
    )
  }
}
