import React, { Component } from 'react'

class TwitterFeed extends Component {
  state = { items: [1, 2] }
  render() {
    return <div>{this.state.items.map(item => <div>{item}</div>)}</div>
  }
}

export default TwitterFeed
