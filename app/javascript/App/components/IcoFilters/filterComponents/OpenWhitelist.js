import React, { Component } from 'react'
import Switch from '../../Switch'

export default class OpenWhitelist extends Component {
  render() {
    const { value: checked, onChange } = this.props
    const label = checked ? 'Open' : 'Closed'
    return (
      <div className="pa3">
        <header>{`${label} Whitelist`}</header>
        <Switch on={!checked} onChange={onChange} />
      </div>
    )
  }
}
