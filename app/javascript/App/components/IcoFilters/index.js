import React from 'react'
import icoFilters from '../../containers/icoFilters'
import AddFilter from './AddFilter'
import FilterButton from './FilterButton'
import Icon from '../Icon'

class IcoFilters extends React.Component {
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
          <div key={`filter-${i}`}>
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

export default icoFilters(IcoFilters)
