import React from 'react'
import CoinListItem from './CoinListItem'

const CoinList = (props) => {
  if (props.coins.length)
    return props.coins.map((coin) => <CoinListItem key={coin.id} coin={coin} />)

  return (
    <span style={{ margin: 10, textAlign: 'center' }}>
      No coins data available
    </span>
  )
}

export default CoinList
