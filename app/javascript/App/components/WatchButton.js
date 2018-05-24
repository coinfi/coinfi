import React, { Component } from 'react'
import API from '../lib/localAPI'
import Icon from './Icon'

export default class WatchButton extends Component {
  state = { coin: null, watching: false }
  componentDidMount() {
    const watching = !!this.props.watching
    this.setState({ watching })
  }
  handleClick = () => {
    const { coinID: id, onWatch, onChange } = this.props
    const { watching } = this.state
    if (watching) {
      API.delete(`/watchlist/coins/${id}.json`).then(({ type }) => {
        if (type === 'success') {
          this.setState({ coin: null, watching: false })
          if (onChange) onChange({ id, watching: false })
        }
      })
    } else {
      API.post('/watchlist/coins.json', { id }).then(
        ({ type, payload: coin }) => {
          if (type === 'success') {
            this.setState({ coin, watching: true })
            if (onWatch) onWatch()
            if (onChange) onChange({ id, watching: true })
          }
        }
      )
    }
  }
  render() {
    const { watching } = this.state
    let btnClass = 'btn btn-xs'
    if (watching) btnClass += ' btn-blue'
    if (!watching) btnClass += ' btn-gray'
    return (
      <button onClick={this.handleClick} className={btnClass}>
        {watching ? (
          <span>
            <Icon name="star" solid className="mr1" />
            Watching
          </span>
        ) : (
          <span>
            <Icon name="star" regular className="mr1" />
            Watch
          </span>
        )}
      </button>
    )
  }
}
