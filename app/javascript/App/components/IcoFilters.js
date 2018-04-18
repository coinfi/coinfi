import React from 'react'
import IcoFiltersContainer from '../containers/IcoFiltersContainer'

class IcoFilters extends React.Component {
  render() {
    const { UI, toggleNew } = this.props
    return (
      <div className="pv4">
        <div className="flex-stack">
          <div>
            <button className="select-button">
              <i className="fas fa-search" />
            </button>
          </div>
          <div>
            <button className="select-button" onClick={toggleNew}>
              <i className="fas fa-plus" />
            </button>
            {UI.get('newFilter') && <div>new filter</div>}
          </div>
        </div>
      </div>
    )
  }
}

export default IcoFiltersContainer(IcoFilters)
