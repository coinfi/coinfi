import * as React from 'react'

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
    <IconWrapper onClick={props.onClick}>
      <i className={`${props.className} pr1 ${prefix} fa-${props.name}`} />
      {props.children}
    </IconWrapper>
  )
}

const IconWrapper = ({ onClick, children }) =>
  onClick ? (
    <button
      data-heap="news-add-coin-to-watchlist-button"
      className="btn-icon icon"
      onClick={onClick}
    >
      {children}
    </button>
  ) : (
    <div className="btn-icon icon">{children}</div>
  )

export default Icon
