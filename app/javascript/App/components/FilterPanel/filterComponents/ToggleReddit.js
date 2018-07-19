import React, { Component } from 'react'
import Switch from '../../Switch'
import RedditLogo from '../../../images/logo-reddit.svg'

class ToggleReddit extends Component {
  handleToggleReddit() {
  }

  render() {
    return (
      <div className="pv2">
        <span className="mr2">
          <img src={RedditLogo} className="mr2 v-top" />
          Reddit
        </span>
        <Switch onChange={() => this.handleToggleReddit()} />
      </div>
    )
  }
}

export default ToggleReddit
