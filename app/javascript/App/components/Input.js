import React, { Component } from 'react'

export default class Input extends Component {
  render() {
    const { type, autoFocus, ...rest } = this.props
    return (
      <input type={type || 'text'} {...rest} autoFocus={autoFocus || false} />
    )
  }
}
