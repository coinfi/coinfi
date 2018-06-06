import React, { Fragment } from 'react'
import CoinListItem from './CoinListItem'
import LoadingIndicator from '../LoadingIndicator'

export default (props) => {
  const { coins, isLoading } = props
  return (
    <Fragment>
      {isLoading('coins') && (
        <LoadingIndicator className="overlay bg-white-70" />
      )}
      {coins.map((coin, index) => (
        <CoinListItem key={index} coin={coin} {...props} />
      ))}
    </Fragment>
  )
}
