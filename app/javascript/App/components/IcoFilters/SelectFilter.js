import React, { Component } from 'react'
import Icon from '../Icon'
import clickOutside from 'react-onclickoutside'

class SelectFilter extends Component {
  handleClickOutside() {
    const { currentUI, uiKey, toggleUI } = this.props
    if (currentUI(uiKey)) toggleUI(uiKey)
  }
  render() {
    const { toggleUI, availableFilters, disabledFilters } = this.props
    return (
      <div className="oi-pane-content">
        <header>Add a filter</header>
        <div className="pv2">
          <ul>
            {availableFilters.map(item => (
              <li key={item.get('key')}>
                <button onClick={() => toggleUI('newFilter', item.get('key'))}>
                  <div>{item.get('label')}</div>
                  <Icon name="plus" className="ml3 aqua" />
                </button>
              </li>
            ))}
          </ul>
          {disabledFilters.size > 0 && (
            <div className="o-50">
              <header>Coming soon</header>
              <ul>
                {disabledFilters.map(item => (
                  <li key={item.get('key')}>
                    <button disabled={true}>
                      <div>{item.get('label')}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }
}

SelectFilter = clickOutside(SelectFilter)

export default props => (
  <div className="oi-pane">
    <SelectFilter {...props} />
  </div>
)
