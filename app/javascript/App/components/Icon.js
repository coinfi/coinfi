import React from 'react'

/*
 * Simple wrapper for FontAwesome.
 * Wrapping div required to prevent error on unmount.
 */

export default ({ name, brand, regular, solid, className, ...rest }) => {
  let prefix = 'fal'
  if (regular) prefix = 'far'
  if (solid) prefix = 'fas'
  if (brand) prefix = 'fab'
  return (
    <div className="icon" {...rest}>
      <i className={`${prefix} fa-${name} ${className || ''}`} />
    </div>
  )
}
