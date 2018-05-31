import React from 'react'
import CoinListItem from './CoinListItem'
import LoadingIndicator from '../LoadingIndicator'

export default (props) => {
  const { coins, isLoading } = props
  return (
    <div>
      {isLoading('coins') && <LoadingIndicator />}
      {coins.map((coin, index) => (
        <CoinListItem key={index} coin={coin} {...props} />
      ))}
    </div>
  )
}
