import React, { Fragment } from 'react'
import CoinList from './CoinList'
import CoinListHeader from './CoinListHeader'
import CoinListContext from '../../../contexts/CoinListContext'

export default () => (
  <CoinListContext.Consumer>
    {(payload) => {
      return payload.isInitializing() ? (
        <div style={{ margin: 10, textAlign: 'center' }}>Loading...</div>
      ) : (
        <Fragment>
          <CoinListHeader />
          <CoinList coins={payload.coinlist} />
        </Fragment>
      )
    }}
  </CoinListContext.Consumer>
)
