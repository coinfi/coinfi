import React from 'react'
import Icon from '../../Icon'

export default props => {
  const { toggleUI, availableFilters } = props
  return (
    <div className="pa3">
      <ul>
        {availableFilters.map(item => (
          <li key={item.key}>
            <button onClick={() => toggleUI('newFilter', item.key)}>
              <div>{item.label}</div>
              <Icon name="plus" className="ml3 aqua" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
