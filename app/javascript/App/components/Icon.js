import React from 'react'

/*
 * Simple wrapper for FontAwesome.
 * Wrapping div/button required to prevent error on unmount.
 */

export default ({ name, brand, regular, solid, className, ...rest }) => {
  let prefix = 'fal'
  if (regular) prefix = 'far'
  if (solid) prefix = 'fas'
  if (brand) prefix = 'fab'
  return (
    <IconWrapper {...rest}>
      <i className={`${prefix} fa-${name} ${className || ''}`} />
    </IconWrapper>
  )
}

const IconWrapper = ({ onClick, children, ...rest }) => {
  if (onClick) {
    return (
      <button className="btn-icon icon" onClick={onClick}>
        {children}
      </button>
    )
  } else {
    return <div className="icon">{children}</div>
  }
}
