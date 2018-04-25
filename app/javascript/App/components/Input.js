import React, { Component } from 'react'

export default class Input extends Component {
  render() {
    const { type, autoFocus, setRef, onChange, ...rest } = this.props
    const ref = setRef || null
    return (
      <input
        type={type || 'text'}
        ref={ref}
        {...rest}
        onChange={({ target: { value } }) => onChange(value)}
        autoFocus={autoFocus || false}
      />
    )
  }
}
