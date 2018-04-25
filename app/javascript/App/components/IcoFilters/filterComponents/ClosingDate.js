import React, { Component } from 'react'
import Input from '../../Input'
export default class ClosingDate extends Component {
  render() {
    const { value } = this.props
    return (
      <div className="pa3">
        <Input value={value || ''} type="date" onChange={this.props.onChange} />
      </div>
    )
  }
}
