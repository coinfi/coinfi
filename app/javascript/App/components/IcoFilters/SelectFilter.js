import React from 'react'
import Icon from '../Icon'
import enhanceWithClickOutside from 'react-click-outside'

class SelectFilter extends React.Component {
  handleClickOutside() {
    const { currentUI, uiKey, toggleUI } = this.props
    if (currentUI(uiKey)) toggleUI(uiKey)
  }
  render() {
    const { toggleUI, availableFilters } = this.props
    return (
      <div className="oi-pane">
        <div className="oi-pane-content">
          <div className="pv2">
            <ul>
              {availableFilters.map(item => (
                <li key={item.get('key')}>
                  <button
                    onClick={() => toggleUI('newFilter', item.get('key'))}
                  >
                    <div>{item.get('label')}</div>
                    <Icon name="plus" className="ml3 aqua" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default enhanceWithClickOutside(SelectFilter)
