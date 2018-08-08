import React from 'react'
import CoinListContext from '../../../contexts/CoinListContext'

export default () => (
  <CoinListContext.Consumer>
    {(payload) => {
      console.log(payload)
      return <div>Payload here</div>
    }}
  </CoinListContext.Consumer>
)
