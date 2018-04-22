import React from 'react'

export default props => {
  const { toggleUI, availableFilters } = props
  return (
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
  )
}
