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
  noPadding?: boolean
  [x: string]: any
}

export interface IconWrapperProps {
  onClick?: () => void
  className?: string
  [x: string]: any
}

const Icon = ({
  name,
  brand,
  regular,
  solid,
  children,
  noPadding,
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
  let className = noPadding ? '' : 'pr1 '
  className += `${prefix} fa-${name}`
  return (
    <IconWrapper {...rest}>
      <i className={className} />
      {children}
    </IconWrapper>
  )
}

const IconWrapper = ({
  onClick,
  children,
  style,
  className,
  dataHeapTag,
  ...rest
}: IconWrapperProps) => {
  const klass = className || ''
  if (onClick) {
    return (
      <button
        data-heap={dataHeapTag}
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

export default Icon
