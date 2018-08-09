import React from 'react'
import CoinListItem from './CoinListItem'

export default ({ list }) =>
  list.map((coin) => <CoinListItem key={coin.id} coin={coin} />)
