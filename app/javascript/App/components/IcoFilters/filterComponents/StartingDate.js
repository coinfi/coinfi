import React, { Component } from 'react'
import Input from '../../Input'
export default class StartingDate extends Component {
  render() {
    const { value } = this.props
    return (
      <div className="pa3 pt0">
        <Input value={value || ''} type="date" onChange={this.props.onChange} />
      </div>
    )
  }
}
