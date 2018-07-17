import React from 'react'
import Icon from '../Icon'

const WatchButton = ({
  isWatching,
  coin,
  updateUser,
  onWatch,
  hasText,
  user,
  addCoinsToWatchlist,
  rmCoinsWatchlist,
  searchCoinsHandler
}) => {
  const hasTextClassNames = 'btn btn-xs btn-gray'

  if (isWatching(coin.get('id'))) {
    return (
      <Icon
        name="star"
        solid
        className={`aqua ${hasText ? hasTextClassNames : ''}`}
        onClick={() => {
          updateUser({ unwatchCoin: coin.get('id') })
          rmCoinsWatchlist(coin.get('symbol'))
        }}>
        {hasText && 'Watching'}
      </Icon>
    )
  }
  return (
    <div className="div tooltipped">
      <Icon
        name="star"
        light
        className={`light-silver ${hasText ? hasTextClassNames : ''}`}
        onClick={() => {
          // TODO: Implement new onboarding signup flow.
          if (!user) return (window.location = '/login')
          if (onWatch) onWatch(coin)
          updateUser({ watchCoin: coin.get('id') })
          addCoinsToWatchlist(coin.get('symbol'))
        }}
      >
        {hasText && 'Watch'}
      </Icon>
    </div>
  )
}

export default WatchButton
