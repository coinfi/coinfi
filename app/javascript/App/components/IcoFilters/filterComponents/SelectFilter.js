import React from 'react'
import Icon from '../../Icon'

export default props => {
  const { toggleUI, availableFilters } = props
  return (
    <div className="pa3">
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
    </div>
  )
}
