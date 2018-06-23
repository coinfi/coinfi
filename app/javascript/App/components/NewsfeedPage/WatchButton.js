import React from 'react'
import Icon from '../Icon'

const WatchButton = ({ isWatching, coin, updateUser, user, onWatch, hasText }) => {
  const hasTextClassNames = "btn btn-xs btn-gray"

  if (isWatching(coin.get('id'))) {
    return (
      <Icon
        name="star"
        solid
        className={`aqua ${hasText ? hasTextClassNames : ''}`}
        onClick={() => updateUser({ unwatchCoin: coin.get('id') })}>
        {hasText && 'Watching'}
      </Icon>
    )
  }
  return (
    <div className="div tooltipped">
      {!user && <div className="tooltip fl">Login to watch</div>}
      <Icon
        name="star"
        light
        className={`light-silver ${hasText ? hasTextClassNames : ''}`}
        onClick={() => {
          if (onWatch) onWatch(coin)
          updateUser({ watchCoin: coin.get('id') })
        }}
      >
        {hasText && 'Watch'}
      </Icon>
    </div>
  )
}

export default WatchButton
