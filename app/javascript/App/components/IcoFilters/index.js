import React from 'react'
import IcoFiltersContainer from '../../containers/IcoFiltersContainer'
import AddFilter from './AddFilter'
import FilterButton from './FilterButton'

class IcoFilters extends React.Component {
  render() {
    const { activeFilters } = this.props
    return (
      <div className="pv4 phr">
        <div className="flex-stack">
          <div>
            <button className="oi-btn">
              <i className="fas fa-search" />
            </button>
          </div>
          {activeFilters.map((filter, i) => (
            <div>
              <FilterButton
                key={`filter-${i}`}
                filter={filter}
                {...this.props}
              />
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

export default IcoFiltersContainer(IcoFilters)
