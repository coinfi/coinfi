import React from 'react'
import Icon from '../Icon'
import clickOutside from 'react-onclickoutside'

class SelectFilter extends React.Component {
  handleClickOutside() {
    const { currentUI, uiKey, toggleUI } = this.props
    if (currentUI(uiKey)) toggleUI(uiKey)
  }
  render() {
    const { toggleUI, inactiveFilters } = this.props
    return (
      <div className="oi-pane-content">
        <header>Select a filter</header>
        <div className="pv2">
          <ul>
            {inactiveFilters.map(item => (
              <li key={item.get('key')}>
                <button onClick={() => toggleUI('newFilter', item.get('key'))}>
                  <div>{item.get('label')}</div>
                  <Icon name="plus" className="ml3 aqua" />
                </button>
              </li>
            ))}
          </ul>
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
