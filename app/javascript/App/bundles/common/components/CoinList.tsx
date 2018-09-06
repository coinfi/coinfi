import * as React from 'react'
import CoinListItem from '~/bundles/common/components/CoinListItem'
import { ICoin } from '~/bundles/common/types'

interface IProps {
  list: ICoin[]
  loggedIn: boolean
}

const CoinList = (props: IProps) => (
  <>
    {props.list.map((coin) => (
      <CoinListItem key={coin.id} coin={coin} loggedIn={props.loggedIn} />
    ))}
  </>
)

export default CoinList
