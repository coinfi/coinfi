import React from 'react'

/*
 * Simple wrapper for FontAwesome.
 * Wrapping div/button required to prevent error on unmount.
 */

export default ({ name, brand, regular, solid, children, ...rest }) => {
  let prefix = 'fal'
  if (regular) prefix = 'far'
  if (solid) prefix = 'fas'
  if (brand) prefix = 'fab'
  return (
    <IconWrapper {...rest}>
      <i className={`pr1 ${prefix} fa-${name}`} />
      {children}
    </IconWrapper>
  )
}

const IconWrapper = ({ onClick, children, className }) => {
  const klass = className || ''
  if (onClick) {
    return (
      <button className={`btn-icon icon ${klass}`} onClick={onClick}>
        {children}
      </button>
    )
  } else {
    return <div className={`icon ${klass}`}>{children}</div>
  }
}
