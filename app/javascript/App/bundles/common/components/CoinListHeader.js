import React, { Component } from 'react'
import CoinListContext from '../../../contexts/CoinListContext'

class CoinListHeader extends Component {
  render() {
    return (
      <CoinListContext.Consumer>
        {(payload) => (
          <div
            className="pa3 b--b flex-none flex justify-between items-center bg-athens"
            style={{ height: 60 }}
          >
            <a onClick={payload.showToplist} className="f5">
              Toplist
            </a>
            <a onClick={payload.showWatchlist} className="f5">
              Watchlist
            </a>
          </div>
        )}
      </CoinListContext.Consumer>
    )
  }
}

export default CoinListHeader
