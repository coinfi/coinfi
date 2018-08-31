import React, { Component } from 'react'
import styled from 'styled-components'
import CoinListContext from '../../../contexts/CoinListContext'

const Tab = styled.div`
  padding: 0 !important;
  margin: 0 !important;
  flex: 1;
  height: 60px;
  align-items: flex-end !important;
  display: flex !important;
  justify-content: center !important;
  padding-bottom: 12px !important;
  border-bottom: ${(props) =>
    props.selected ? '2px solid #23adf0' : '2px solid transparent'} !important;
`

const Link = styled.a`
  cursor: pointer;
  color: ${(props) =>
    props.selected ? '#23adf0 !important' : '#555 !important'};
  font-weight: 100;
`

class CoinListHeader extends Component {
  render() {
    return (
      <CoinListContext.Consumer>
        {(payload) => (
          <div className="b--b flex-none flex justify-between items-center bg-athens tabs">
            <Tab
              className="tab"
              selected={!payload.isWatchlist}
              onClick={payload.showToplist}
            >
              <Link data-head="toplist-toggle" selected={!payload.isWatchlist}>
                Toplist
              </Link>
            </Tab>
            <Tab
              className="tab"
              selected={payload.isWatchlist}
              onClick={payload.showWatchlist}
            >
              <Link data-head="watchlist-toggle" selected={payload.isWatchlist}>
                Watchlist
              </Link>
            </Tab>
          </div>
        )}
      </CoinListContext.Consumer>
    )
  }
}

export default CoinListHeader
