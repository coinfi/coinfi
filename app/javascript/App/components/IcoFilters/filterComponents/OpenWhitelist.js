import React, { Component } from 'react'
import { Switch } from 'element-react'

export default class OpenWhitelist extends Component {
  render() {
    const { value: checked, setFilter } = this.props
    const label = checked ? 'Open' : 'Closed'
    return (
      <div className="pa3">
        <header>{`${label} Whitelist`}</header>
        <Switch
          value={!!checked}
          onText="Open"
          offText="Closed"
          onChange={v => setFilter('openWhitelist', v)}
        />
      </div>
    )
  }
}
