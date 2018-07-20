import React from 'react'
import Icon from './Icon'

const PercentageChange = ({ value, className, ...rest }) => {
  const n = parseFloat(value)
  let iconName = 'caret-up'
  let klass = 'green'
  if (n < 0) {
    iconName = 'caret-down'
    klass = 'sunset'
  }
  if (className) klass = `${className} ${klass}`
  let percentage = `${Math.abs(n)}%`
  if (isNaN(n)) return (<div />)
  return (
    <span className={klass} {...rest}>
      <Icon name={iconName} solid className="mr1" />
      {percentage}
    </span>
  )
}

export default PercentageChange
