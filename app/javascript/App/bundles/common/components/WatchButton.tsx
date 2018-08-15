import * as React from 'react'
import Icon from '../../../components/Icon'
import CoinListContext from '../../../contexts/CoinListContext'
import { Coin } from '../types';

interface Props {
  coin: Coin,
  hasText: boolean,
  loggedIn: boolean,
}

const WatchButton = ({
  coin,
  hasText,
  loggedIn,
}: Props) => {
  const hasTextClassNames = 'btn btn-xs btn-gray'

  return (
    <CoinListContext.Consumer>
      {(payload) => {
        if (loggedIn) {
          if (payload.isCoinInWatchlist(coin.id)) {
            return (
              <Icon
                name="star"
                solid
                className={`aqua ${hasText ? hasTextClassNames : ''}`}
                onClick={() => {
                  payload.removeCoinFromWatchlist(coin.symbol)
                  // updateUser({ unwatchCoin: coin.id }) // TODO: why not update the user in removeCoinsWatchList?
                }}
              >
                {hasText && 'Watching'}
              </Icon>
            )
          } else {
            return (
              <Icon
                name="star"
                light
                className={`light-silver ${hasText ? hasTextClassNames : ''}`}
                onClick={() => {
                  payload.addCoinToWatchlist(coin.symbol)
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
              light
              className={`light-silver ${hasText ? hasTextClassNames : ''}`}
              onClick={() => {
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

export default WatchButton
