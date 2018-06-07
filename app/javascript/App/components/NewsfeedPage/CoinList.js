import React, { Fragment } from 'react'
import CoinListItem from './CoinListItem'
import LoadingIndicator from '../LoadingIndicator'

export default (props) => {
  const { coins, isLoading, setActiveEntity } = props
  const onClick = (coin) =>
    setActiveEntity({
      type: 'coin',
      id: coin.get('id'),
      label: coin.get('name')
    })
  return (
    <Fragment>
      {isLoading('coins') && (
        <LoadingIndicator className="overlay bg-white-70" />
      )}
      {coins.map((coin, index) => (
        <CoinListItem key={index} coin={coin} {...props} onClick={onClick} />
      ))}
    </Fragment>
  )
}
