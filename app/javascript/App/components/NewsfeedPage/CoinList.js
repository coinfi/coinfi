import React from 'react'
import CoinListItem from './CoinListItem'

export default (props) => {
  return (
    <div>
      {props.coins.map((coin, index) => (
        <CoinListItem key={index} coin={coin} {...props} />
      ))}
    </div>
  )
}
