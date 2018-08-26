import React from 'react'
import CoinListItem from './CoinListItem'

const CoinList = (props) => {
  if (props.coins) {
    return props.coins.map((coin) => <CoinListItem key={coin.id} coin={coin} />)
  }

  return
}

export default CoinList
