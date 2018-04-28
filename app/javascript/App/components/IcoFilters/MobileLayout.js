import React, { Component } from 'react'
import AddFilter from './AddFilter'
import FilterButton from './FilterButton'
import Icon from '../Icon'

export default class MobileLayout extends Component {
  toggleFilters = () => {
    this.props.toggleUI('mobileFilters')
  }
  render() {
    const { activeFilters, currentUI } = this.props
    return (
      <div id="ico-filters-mobile" className="ba b--geyser">
        {!currentUI('mobileFilters') ? (
          <button
            onClick={this.toggleFilters}
            className="btn-reset w-100 flex items-center justify-center pa3"
          >
            <div>{`${activeFilters.size} filters applied`}</div>
            <Icon name="angle-down" className="ml3" />
          </button>
        ) : (
          <div>
            {activeFilters.map((filter, i) => (
              <FilterButton filter={filter} {...this.props} />
            ))}
          </div>
        )}
      </div>
    )
  }
}
