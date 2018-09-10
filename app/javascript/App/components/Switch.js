import React, { Component } from 'react'
import darkModeHelper from '~/darkModeHelper'

export default class Switch extends Component {
  state = { on: false }
  componentDidMount() {
    const { on } = this.props
    this.setState({ on: !!on })
  }
  handleChange = () => {
    const { onChange } = this.props
    const { on } = this.state
    this.setState({ on: !on })
    onChange(!on)
    darkModeHelper()
  }
  render() {
    const { on } = this.state
    return (
      <button
        className={`switch ${on ? 'on' : ''}`}
        onClick={this.handleChange}
      />
    )
  }
}
