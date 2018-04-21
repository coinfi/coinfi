import React from 'react'
import IcoFiltersContainer from '../../containers/IcoFiltersContainer'
import AddFilter from './AddFilter'

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
          {activeFilters.map(filter => (
            <div className="oi" key={`filter-${filter.get('key')}`}>
              <button className="oi-btn">
                <label>{filter.get('label')}</label>
                {typeof filter.get('value') === 'object' ? (
                  <div>{filter.get('value').size} selected</div>
                ) : (
                  <div>{filter.get('value')}</div>
                )}
              </button>
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
