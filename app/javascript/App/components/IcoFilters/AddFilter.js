import React from 'react'
import enhanceWithClickOutside from 'react-click-outside'

class AddFilter extends React.Component {
  handleClickOutside() {
    const { showing, toggleUI } = this.props
    if (showing('newFilter')) toggleUI('newFilter')
  }
  SelectedFilterComponent = props => {
    const { showing, filterList, activeFilters } = this.props
    const key = showing('newFilter')
    const config = filterList.find(item => item.key === key)
    if (!config) {
      console.error(`Filter config not found for "${key}"`)
      return null
    }
    const { Component } = config
    const activeFilter = activeFilters.find(o => o.get('key') === key)
    const value = activeFilter ? activeFilter.get('value') : null
    return <Component {...props} value={value} />
  }
  render() {
    const { showing, toggleUI, availableFilters } = this.props
    const { SelectedFilterComponent } = this
    return (
      <div className="oi">
        <button
          className="oi-btn"
          onClick={() => toggleUI('newFilter', 'step1')}
        >
          <i className="fas fa-plus" />
        </button>
        {showing('newFilter') && (
          <div className="oi-pane">
            <div className="oi-pane-content pa3">
              {showing('newFilter', 'step1') ? (
                <ul>
                  {availableFilters.map(item => (
                    <li key={item.key}>
                      <button onClick={() => toggleUI('newFilter', item.key)}>
                        <div>{item.label}</div>
                        <i className="fas fa-plus ml3 aqua" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <SelectedFilterComponent {...this.props} />
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default enhanceWithClickOutside(AddFilter)
