import * as React from 'react'
import CoinListItem from '~/bundles/common/components/CoinListItem'
import { ICoin } from '~/bundles/common/types'

interface IProps {
  list: ICoin[]
  loggedIn: boolean
  onSelectCoin: (coin: ICoin) => void
  selectedCoin?: ICoin
}

const CoinList = (props: IProps) => (
  <>
    {props.list.map((coin) => (
      <CoinListItem 
        key={coin.id} 
        coin={coin}
        loggedIn={props.loggedIn}
        onSelectCoin={props.onSelectCoin}
        isSelected={!!props.selectedCoin && props.selectedCoin.id === coin.id}
      />
    ))}
  </>
)

export default CoinList
