import React, { Component } from 'react'

export default class Input extends Component {
  handleChange = ({ target: { value } }) => {
    const { onChange } = this.props
    if (onChange) onChange(value)
  }
  handleKeyPress = ({ key, target: { value } }) => {
    const { onEnter } = this.props
    if (!onEnter) return
    if (key === 'Enter') onEnter(value)
  }
  render() {
    const { type, autoFocus, setRef, onEnter, ...rest } = this.props
    return (
      <input
        type={type || 'text'}
        ref={setRef || null}
        {...rest}
        onChange={this.handleChange}
        autoFocus={autoFocus || false}
        onKeyPress={this.handleKeyPress}
      />
    )
  }
}
