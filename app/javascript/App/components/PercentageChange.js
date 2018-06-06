import React from 'react'
import Icon from './Icon'

export default ({ number, className, ...rest }) => {
  const n = parseFloat(number)
  let iconName = 'caret-up'
  let klass = 'green'
  if (n < 0) {
    iconName = 'caret-down'
    klass = 'sunset'
  }
  if (className) klass = `${className} ${klass}`
  return (
    <span className={klass} {...rest}>
      <Icon name={iconName} solid className="mr1" />
      {`${Math.abs(n)}%`}
    </span>
  )
}
