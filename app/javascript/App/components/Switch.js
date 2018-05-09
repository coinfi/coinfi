import React from 'react'

export default class Switch extends React.Component {
  state = { on: false }
  componentWillMount() {
    const { on } = this.props
    this.setState({ on: !!on })
  }
  handleChange = () => {
    console.log(this.state)
    const { onChange } = this.props
    const { on } = this.state
    this.setState({ on: !on })
    onChange(!on)
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
