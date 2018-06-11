import React, { Fragment } from 'react'
import CoinListHeader from './CoinListHeader'
import CoinListItem from './CoinListItem'
import CoinListSearchItem from './CoinListSearchItem'
import LoadingIndicator from '../LoadingIndicator'
import coinSearchProvider from '../../containers/coinSearch'

const CoinList = (props) => {
  const {
    isLoading,
    setActiveEntity,
    currentUI,
    isWatching,
    searchedCoins
  } = props
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
      {searchedCoins.size > 0 &&
        searchedCoins.map((coin, key) => (
          <CoinListSearchItem {...{ coin, key }} />
        ))}
      {coins.map((coin, index) => (
        <CoinListItem key={index} coin={coin} {...props} onClick={onClick} />
      ))}
    </Fragment>
  )
}

export default coinSearchProvider('newsfeed')(CoinList)
