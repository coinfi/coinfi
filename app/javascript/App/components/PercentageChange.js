import React from 'react'

export default ({ number, className, ...rest }) => {
  const n = parseFloat(number)
  let pol = '+'
  let klass = 'green'
  if (n < 0) {
    pol = '-'
    klass = 'sunset'
  }
  if (className) klass = `${className} ${klass}`
  return <span className={klass} {...rest}>{`${pol}${n}%`}</span>
}
