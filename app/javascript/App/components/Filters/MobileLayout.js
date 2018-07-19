import React, { Component } from 'react'
import AddFilter from './AddFilter'
import FilterButton from './FilterButton'
import Icon from '../Icon'

export default class MobileLayout extends Component {
  toggleFilters = () => {
    const { toggleUI, activeFilters } = this.props
    toggleUI('mobileFilters')
    if (activeFilters.size === 0) toggleUI(['newFilter', 'selectFilter'])
  }
  render() {
    const { activeFilters, currentUI } = this.props
    const isOpen = currentUI('mobileFilters')
    return (
      <div className="oi-layout-mobile">
        <div
          onClick={this.toggleFilters}
          className="flex items-center justify-center pa3"
        >
          <div>{`${activeFilters.size} filters applied`}</div>
          <Icon name={isOpen ? 'angle-up' : 'angle-down'} className="ml3 f4" />
        </div>
        {isOpen && (
          <div>
            {activeFilters.map((filter, i) => (
              <FilterButton key={i} filter={filter} {...this.props} />
            ))}
            <AddFilter {...this.props} />
          </div>
        )}
      </div>
    )
  }
}
