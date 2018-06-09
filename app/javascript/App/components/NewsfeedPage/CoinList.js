import React, { Fragment } from 'react'
import CoinListHeader from './CoinListHeader'
import CoinListItem from './CoinListItem'
import LoadingIndicator from '../LoadingIndicator'

export default (props) => {
  const { isLoading, setActiveEntity, currentUI, isWatching } = props
  const onClick = (coin) =>
    setActiveEntity({
      type: 'coin',
      id: coin.get('id'),
      label: coin.get('name')
    })
  let { coins } = props
  if (currentUI('watchingOnly')) {
    coins = props.coins.filter((coin) => isWatching(coin.get('id')))
  }
  return (
    <Fragment>
      <CoinListHeader {...props} />
      {isLoading('coins') && (
        <LoadingIndicator className="overlay bg-white-70" />
      )}
      {coins.map((coin, index) => (
        <CoinListItem key={index} coin={coin} {...props} onClick={onClick} />
      ))}
    </Fragment>
  )
}
