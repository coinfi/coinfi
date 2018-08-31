import * as React from 'react'

const Switch = (props) => {
  const { on } = props
  return (
    <button className={`switch ${!!on ? 'on' : ''}`} onClick={props.onChange} />
  )
}

export default Switch
