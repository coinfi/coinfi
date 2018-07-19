import React from 'react'
import Icon from './Icon'

const PercentageChange = ({value, className, ...rest}) => {
  const n = parseFloat(value)
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

export default PercentageChange
