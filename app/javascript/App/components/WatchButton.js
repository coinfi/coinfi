import React, { Component } from 'react'
import API from '../lib/localAPI'
import Icon from './Icon'

export default class WatchButton extends Component {
  state = { watching: false }
  componentDidMount() {
    const watching = !!this.props.watching
    this.setState({ watching })
  }
  userIsLoggedIn = !!(this.props.user || this.props.loggedIn)
  handleClick = () => {
    if (!this.userIsLoggedIn) return
    /* This component does its own API request & state management since it's
    sometimes used on its own, and doesn't have access to Redux */
    const { coinID: id, onWatch, onChange, setUser } = this.props
    let { watching } = this.state
    let params = { watchCoin: id }
    if (watching) params = { unwatchCoin: id }
    API.patch('/user', params).then(({ type, payload }) => {
      if (type === 'success') {
        if (setUser) setUser(payload)
        watching = payload.coin_ids.includes(id)
        this.setState({ watching })
        if (watching && onWatch) onWatch()
        if (onChange) onChange(watching)
      }
    })
  }
  render() {
    const { watching } = this.state
    let btnClass = 'btn'
    if (!watching) btnClass += ' btn-blue'
    if (watching) btnClass += ' btn-gray'

    if (this.props.coinDetail) {
      return (
        <div className="dib tooltipped" style={{width: '100%', marginTop: 50}}>
          {!this.userIsLoggedIn && <div className="tooltip">Login to watch</div>}
          <button onClick={this.handleClick} className={btnClass} style={{width:'100%', textTransform:'none', padding:15}}>
            {watching ? (
              <span>
                <Icon name="star" solid className="mr1" />
                Watching coin
              </span>
            ) : (
              <span>
                <Icon name="star" regular className="mr1" />
                Watch coin
              </span>
            )}
          </button>
        </div>
      )
    }
    return (
      <div className="dib tooltipped">
        {!this.userIsLoggedIn && <div className="tooltip">Login to watch</div>}
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
      </div>
    )
  }
}
