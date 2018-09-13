import * as React from 'react'
import CoinListItem from '~/bundles/common/components/CoinListItem'
import { Coin } from '~/bundles/common/types'

interface Props {
  list: Coin[]
  loggedIn: boolean
  onSelectCoin: (coin: Coin) => void
  selectedCoinSlug?: string
}

const CoinList = (props: Props) => (
  <div className="flex-auto relative overflow-y-scroll coin-watch-list">
    {props.list.map((coin) => (
      <CoinListItem
        key={coin.id}
        coin={coin}
        loggedIn={props.loggedIn}
        onSelectCoin={props.onSelectCoin}
        isSelected={
          !!props.selectedCoinSlug && props.selectedCoinSlug === coin.slug
        }
      />
    ))}
  </div>
)

export default CoinList
