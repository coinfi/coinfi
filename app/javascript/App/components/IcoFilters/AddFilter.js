import React from 'react'
import enhanceWithClickOutside from 'react-click-outside'

class AddFilter extends React.Component {
  handleClickOutside() {
    const { UI, toggleUI } = this.props
    if (UI('newFilter')) toggleUI('newFilter')
  }
  render() {
    const { UI, toggleUI, availableFilters } = this.props
    return (
      <div className="relative">
        <button className="oi-btn" onClick={() => toggleUI('newFilter')}>
          <i className="fas fa-plus" />
        </button>
        {UI('newFilter') && (
          <div className="oi-pane absolute top-0 left-0">
            {availableFilters.map(item => (
              <div key={item.key}>{item.label}</div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default enhanceWithClickOutside(AddFilter)
