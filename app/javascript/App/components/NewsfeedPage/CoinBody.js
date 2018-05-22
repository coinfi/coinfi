import React, { Component } from 'react'

export default class CoinBody extends Component {
  componentWillMount() {
    const { currentItem, fetchEntity } = this.props
    fetchEntity('coin', currentItem.id)
  }
  render() {
    return (
      <div className="pa4">
        <div className="flex justify-between">
          <div>name</div>
          <div>Watch</div>
        </div>
      </div>
    )
  }
}
