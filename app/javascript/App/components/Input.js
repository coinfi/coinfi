import React, { Component } from 'react'

export default class Input extends Component {
  render() {
    const { type, autoFocus, setRef, ...rest } = this.props
    const ref = setRef || null
    return (
      <input
        type={type || 'text'}
        ref={ref}
        {...rest}
        autoFocus={autoFocus || false}
      />
    )
  }
}
