import * as React from 'react'

/*
 * Simple wrapper for FontAwesome.
 * Wrapping div/button required to prevent error on unmount.
 */

export interface IconProps {
  name: string
  brand?: boolean
  regular?: boolean
  solid?: boolean
  [x: string]: any
}

export interface IconWrapperProps {
  onClick?: () => void
  className?: string
  [x: string]: any
}

export default ({
  name,
  brand,
  regular,
  solid,
  children,
  ...rest
}: IconProps) => {
  let prefix = 'fal'
  if (regular) {
    prefix = 'far'
  }
  if (solid) {
    prefix = 'fas'
  }
  if (brand) {
    prefix = 'fab'
  }
  return (
    <IconWrapper {...rest}>
      <i className={`pr1 ${prefix} fa-${name}`} />
      {children}
    </IconWrapper>
  )
}

const IconWrapper = ({
  onClick,
  children,
  style,
  className,
  ...rest
}: IconWrapperProps) => {
  const klass = className || ''
  if (onClick) {
    return (
      <button
        data-heap="news-add-coin-to-watchlist-button"
        className={`btn-icon icon ${klass}`}
        onClick={onClick}
        style={style}
        {...rest}
      >
        {children}
      </button>
    )
  } else {
    return (
      <div className={`icon ${klass}`} style={style} {...rest}>
        {children}
      </div>
    )
  }
}
