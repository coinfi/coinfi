import React, { Component } from 'react'
import API from '../utils/localAPI'

export default class WatchlistButton extends Component {
  state = { coin: null, watching: false }
  componentDidMount() {
    const { coinID } = this.props
    API.get(`/api/watchlist/coins/${coinID}.json`).then(
      ({ data: { payload: coin } }) => {
        if (coin.id) this.setState({ coin, watching: true })
      }
    )
  }
  handleClick = () => {
    const { coinID } = this.props
    const { watching } = this.state
    if (watching) {
      API.delete(`/api/watchlist/coins/${coinID}.json`).then(
        ({ data: { type } }) => {
          if (type === 'success') this.setState({ coin: null, watching: false })
        }
      )
    } else {
      API.post(`/api/watchlist/coins/${coinID}.json`).then(
        ({ data: { type, payload: coin } }) => {
          if (type === 'success') this.setState({ coin, watching: true })
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
