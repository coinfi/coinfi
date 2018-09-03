import * as React from 'react'
import Icon from '../../../components/Icon'

interface IProps {
  value: string
  className: string
}

const PercentageChange = ({ value, className }: IProps) => {
  const n = parseFloat(value)
  let iconName = 'caret-up'
  let klass = 'green'
  if (n < 0) {
    iconName = 'caret-down'
    klass = 'sunset'
  }
  if (className) {
    klass = `${className} ${klass}`
  }
  const percentage = `${Math.abs(n)}%`
  if (isNaN(n)) {
    return <div />
  }
  return (
    <span className={klass}>
      <Icon name={iconName} solid={true} className="mr1" />
      {percentage}
    </span>
  )
}

export default PercentageChange
