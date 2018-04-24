/*
 * A simple button to toggle some UI: { newFilter: selectFilter }
 *
 * SelectFilter is then rendered via FilterComponent, which then toggles (for
 * example) { newFilter: categories }
 */
import React from 'react'
import FilterComponent from './FilterComponent'

class AddFilter extends React.Component {
  render() {
    const { currentUI, toggleUI } = this.props
    return (
      <div className="oi">
        {currentUI('newFilter') ? (
          <FilterComponent uiKey="newFilter" {...this.props} />
        ) : (
          <button
            className="oi-icon"
            onClick={() => toggleUI('newFilter', 'selectFilter')}
          >
            <i className="fas fa-plus" />
          </button>
        )}
      </div>
    )
  }
}

export default AddFilter
