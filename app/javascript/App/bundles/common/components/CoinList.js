import React from 'react'
import CoinListItem from './CoinListItem'
import _ from 'lodash'

const CoinList = (props) => {
  if (!_.isEmpty(props.coins))
    return props.coins.map((coin) => <CoinListItem key={coin.id} coin={coin} />)

  return (
    <p style={{ margin: 10, textAlign: 'center' }}>No coins data available</p>
  )
}

export default CoinList
