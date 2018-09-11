import * as React from 'react'
import CoinListItem from '~/bundles/common/components/CoinListItem'
import { ICoin } from '~/bundles/common/types'

interface IProps {
  list: ICoin[]
  loggedIn: boolean
  onSelectCoin: (coin: ICoin) => void
  selectedCoinSlug?: string
}

const CoinList = (props: IProps) => (
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
