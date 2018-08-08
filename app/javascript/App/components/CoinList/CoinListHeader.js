import React, { Component } from 'react'
import SectionHeader from '../SectionHeader'

class CoinListHeader extends Component {
  render() {
    const { user } = this.props
    return (
      <SectionHeader>
        <a onClick={() => console.log('toplist')} className="f5">
          Toplist
        </a>
        <a onClick={() => console.log('watchlist')} className="f5">
          Watchlist
        </a>
      </SectionHeader>
    )
  }
}

export default CoinListHeader
