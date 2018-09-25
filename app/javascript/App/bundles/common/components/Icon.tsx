import * as React from 'react'
import classNames from 'classnames'

/*
 * Simple wrapper for FontAwesome.
 * Wrapping div/button required to prevent error on unmount.
 */

interface Props {
  name: string
  styleType?: string
  onClick?: (event) => void
  className?: string
  children?: React.ReactNode
}

const Icon = (props: Props) => {
  let prefix = 'far'
  switch (props.styleType) {
    case 'light':
      prefix = 'fal'
      break
    case 'solid':
      prefix = 'fas'
      break
    case 'brand':
      prefix = 'fab'
      break
  }

  return (
    <IconWrapper onClick={props.onClick} className={props.className}>
      <i className={`pr1 ${prefix} fa-${name}`} />
      {props.children}
    </IconWrapper>
  )
}

const IconWrapper = ({ onClick, children, className }) =>
  onClick ? (
    <button
      data-heap="news-add-coin-to-watchlist-button"
      className={classNames('btn-icon icon', { className })}
      onClick={onClick}
    >
      {children}
    </button>
  ) : (
    <div className={classNames('btn-icon icon', { className })}>{children}</div>
  )

export default Icon
