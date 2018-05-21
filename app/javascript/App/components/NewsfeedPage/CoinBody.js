import React, { Component } from 'react'

export default class CoinBody extends Component {
  componentWillMount() {
    const { currentItem } = this.props
    this.props.fetchEntity('coin', currentItem.id)
  }
  render() {
    return <div className="pa4">This is a coin</div>
  }
}
