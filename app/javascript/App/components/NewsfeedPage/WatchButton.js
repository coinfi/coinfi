import React from 'react'
import Icon from '../Icon'

const WatchButton = ({ isWatching, coin, updateUser, user, onWatch }) => {
  if (isWatching(coin.get('id')))
    return (
      <Icon
        name="star"
        solid
        className="aqua"
        onClick={() => updateUser({ unwatchCoin: coin.get('id') })}
      />
    )
  return (
    <div className="div tooltipped">
      {!user && <div className="tooltip fl">Login to watch</div>}
      <Icon
        name="star"
        light
        className="light-silver"
        onClick={() => {
          if (onWatch) onWatch(coin)
          updateUser({ watchCoin: coin.get('id') })
        }}
      />
    </div>
  )
}

export default WatchButton
