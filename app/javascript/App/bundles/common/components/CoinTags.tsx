import * as React from 'react'
import { ItemWithCoinLinkData } from '../types'

interface Props {
  itemWithCoinLinkData: ItemWithCoinLinkData
  selectCoin?: (CoinLinkData) => void
}

const CoinTags = ({ itemWithCoinLinkData, selectCoin }: Props) => (
  <div>
    {itemWithCoinLinkData.coin_link_data.map((data, index) => {
      const isClickable = !!selectCoin
      const onClickHandler = isClickable
        ? (e) => {
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
            selectCoin(data)
          }
        : undefined

      return (
        <a key={index} className="tag pointer" onClick={onClickHandler}>
          {data.symbol}
        </a>
      )
    })}
  </div>
)

export default CoinTags
