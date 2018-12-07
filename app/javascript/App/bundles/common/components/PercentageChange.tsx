import * as React from 'react'
import Icon from './Icon'

interface Props {
  value: string
  className: string
}

const PercentageChange = ({ value, className }: Props) => {
  const n = parseFloat(value)
  let klass = 'green'
  if (n < 0) {
    klass = 'sunset'
  }
  if (className) {
    klass = `${className} ${klass}`
  }
  const percentage = `${n}%`
  if (isNaN(n)) {
    return <div />
  }
  return <span className={klass}>{percentage}</span>
}

export default PercentageChange
