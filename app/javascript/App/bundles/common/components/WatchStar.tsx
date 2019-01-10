import * as React from 'react'
import Icon from './Icon'
import CoinListContext from '../contexts/CoinListContext'

interface CoinForWatchSatr {
  id: number
}

interface Props {
  coin: CoinForWatchSatr
  hasText: boolean
  loggedIn: boolean
}

const WatchStar = ({ coin, hasText, loggedIn }: Props) => {
  const hasTextClassNames = 'btn btn-xs btn-gray'

  return (
    <CoinListContext.Consumer>
      {(payload) => {
        if (loggedIn) {
          if (payload.isCoinInWatchlist(coin.id)) {
            return (
              <Icon
                name="star"
                solid={true}
                className={`aqua ${hasText ? hasTextClassNames : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  payload.removeCoinFromWatchlist(coin.id)
                }}
              >
                {hasText && 'Watching'}
              </Icon>
            )
          } else {
            return (
              <Icon
                name="star"
                className={`light-silver ${hasText ? hasTextClassNames : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  payload.addCoinToWatchlist(coin.id)
                }}
              >
                {hasText && 'Watch'}
              </Icon>
            )
          }
        }

        return (
          <div className="div tooltipped">
            <Icon
              name="star"
              className={`light-silver ${hasText ? hasTextClassNames : ''}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // TODO: Implement new onboarding signup flow.
                window.location.href = '/login'
              }}
            >
              {hasText && 'Watch'}
            </Icon>
          </div>
        )
      }}
    </CoinListContext.Consumer>
  )
}

export default WatchStar
