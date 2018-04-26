import React, { Component } from 'react'

export default class Input extends Component {
  handleChange = ({ target: { value } }) => {
    const { onChange } = this.props
    if (onChange) onChange(value)
  }
  render() {
    const { type, autoFocus, setRef, ...rest } = this.props
    const ref = setRef || null
    return (
      <input
        type={type || 'text'}
        ref={ref}
        {...rest}
        onChange={this.handleChange}
        autoFocus={autoFocus || false}
      />
    )
  }
}
