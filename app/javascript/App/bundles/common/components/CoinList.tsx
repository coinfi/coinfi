import * as React from 'react'
import CoinListItem from '~/bundles/common/components/CoinListItem'
import { Coin } from '~/bundles/common/types'
import { openSignUpModal } from '~/bundles/common/utils/modals'

interface Props {
  isWatchlist: boolean
  list: Coin[]
  loggedIn: boolean
  onSelectCoin: (coin: Coin) => void
  generateLink?: (coin: Coin) => string
  selectedCoinSlug?: string
}

const CoinList = (props: Props) => (
  <div className="flex-auto relative overflow-y-scroll coin-watch-list">
    {!props.loggedIn && props.isWatchlist ? (
      <div className="pa3 tc">
        Sign up to see coins on your Watchlist here.
        <a className="btn btn-md btn-blue mt3" onClick={openSignUpModal}>
          Sign Up Now
        </a>
      </div>
    ) : (
      props.list.map((coin) => (
        <CoinListItem
          key={coin.id}
          coin={coin}
          loggedIn={props.loggedIn}
          onSelectCoin={props.onSelectCoin}
          generateLink={props.generateLink}
          isSelected={
            !!props.selectedCoinSlug && props.selectedCoinSlug === coin.slug
          }
        />
      ))
    )}
  </div>
)

export default CoinList
