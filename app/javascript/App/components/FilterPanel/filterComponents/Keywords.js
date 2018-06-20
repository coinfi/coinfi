import React, { Component } from 'react'
import Input from '../../Input'

export default class Keywords extends Component {
  render() {
    const { value, onChange } = this.props
    return (
      <Input
        onChange={onChange('keywords')}
        onEnter={this.handleOnEnter}
        value={value || ''}
      />
    )
  }
}
