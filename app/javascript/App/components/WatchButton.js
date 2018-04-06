import React, { Component } from 'react'
import API from '../lib/localAPI'

export default class WatchButton extends Component {
  state = { coin: null, watching: false }
  componentDidMount() {
    const watching = !!this.props.watching
    this.setState({ watching })
  }
  handleClick = () => {
    const { coinID, onSuccess } = this.props
    const { watching } = this.state
    if (watching) {
      API.delete(`/watchlist/coins/${coinID}.json`).then(({ type }) => {
        if (type === 'success') this.setState({ coin: null, watching: false })
      })
    } else {
      API.post('/watchlist/coins.json', { id: coinID }).then(
        ({ type, payload: coin }) => {
          if (type === 'success') {
            this.setState({ coin, watching: true })
            if (onSuccess) onSuccess()
          }
        }
      )
    }
  }
  render() {
    const { watching } = this.state
    return (
      <button onClick={this.handleClick} className="btn btn-xs btn-gray">
        {watching ? (
          <span>
            <i className="fas fa-eye mr1" />
            Watching
          </span>
        ) : (
          <span>
            <i className="fas fa-plus mr1" />
            Watch
          </span>
        )}
      </button>
    )
  }
}
