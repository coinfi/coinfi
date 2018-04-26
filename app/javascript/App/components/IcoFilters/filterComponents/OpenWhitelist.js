import React, { Component } from 'react'
import Switch from '../../Switch'

export default class OpenWhitelist extends Component {
  render() {
    const { value, onChange } = this.props
    const label = value ? 'Open' : 'Closed'
    return (
      <div className="pa3">
        <Switch on={!!value} onChange={onChange} />
        <span className="ml3">{label}</span>
      </div>
    )
  }
}
