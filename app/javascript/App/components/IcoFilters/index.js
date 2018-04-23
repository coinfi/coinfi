import React from 'react'
import icoFilters from '../../containers/icoFilters'
import AddFilter from './AddFilter'
import FilterButton from './FilterButton'

class IcoFilters extends React.Component {
  render() {
    const { activeFilters } = this.props
    return (
      <div className="pv4 phr">
        <div className="flex-stack items-start">
          <div>
            <button className="oi-btn">
              <i className="fas fa-search" />
            </button>
          </div>
          {activeFilters.map((filter, i) => (
            <div key={`filter-${i}`}>
              <FilterButton filter={filter} {...this.props} />
            </div>
          ))}
          <div>
            <AddFilter {...this.props} />
          </div>
          <div />
        </div>
      </div>
    )
  }
}

export default icoFilters(IcoFilters)
