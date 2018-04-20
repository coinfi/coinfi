import React from 'react'
import IcoFiltersContainer from '../../containers/IcoFiltersContainer'
import AddFilter from './AddFilter'

class IcoFilters extends React.Component {
  render() {
    return (
      <div className="pv4">
        <div className="flex-stack">
          <div>
            <button className="oi-btn">
              <i className="fas fa-search" />
            </button>
          </div>
          <div>
            <AddFilter {...this.props} />
          </div>
        </div>
      </div>
    )
  }
}

export default IcoFiltersContainer(IcoFilters)
