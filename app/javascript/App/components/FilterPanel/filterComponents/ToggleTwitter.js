import React, { Component } from 'react'
import Switch from '../../Switch'
import TwitterLogo from '../../../images/logo-twitter.svg'

class ToggleTwitter extends Component {
  handleToggleTwitter() {
  }

  render() {
    return (
      <div className="pv2">
        <span className="mr2">
          <img src={TwitterLogo} className="mr2 v-top" />
          Twitter
        </span>
        <Switch onChange={() => this.handleToggleTwitter()} />
      </div>
    )
  }
}

export default ToggleTwitter
