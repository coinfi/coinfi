import React, { Component } from 'react'
import Input from '../../Input'

export default class Keywords extends Component {
  handleOnEnter = (value) => {
    const { applyFilter, removeFilter } = this.props
    if (value.length > 0) {
      applyFilter()
    } else {
      removeFilter()
    }
  }

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
