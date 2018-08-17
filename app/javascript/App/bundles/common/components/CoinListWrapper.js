import React, { Fragment } from 'react'
import CoinList from './CoinList'
import CoinListHeader from './CoinListHeader'
import CoinListContext from '../../../contexts/CoinListContext'

export default () => (
  <CoinListContext.Consumer>
    {(payload) => {
      return payload.isInitializing() ? (
        <div>Loading...</div>
      ) : (
        <Fragment>
          <CoinListHeader />
          <CoinList list={payload.coinlist} />
        </Fragment>
      )
    }}
  </CoinListContext.Consumer>
)
