import * as React from 'react'
import CoinListContext from '../../contexts/CoinListContext'
import ExchangeListingsPage from './ExchangeListingsPage'

const ExchangeListingsContainer = (props) => (
  <CoinListContext.Consumer>
    {(payload) => (
      <ExchangeListingsPage
        {...props}
        selectedCoin={payload.selectedCoin}
        selectCoin={payload.selectCoin}
      />
    )}
  </CoinListContext.Consumer>
)

export default ExchangeListingsContainer
