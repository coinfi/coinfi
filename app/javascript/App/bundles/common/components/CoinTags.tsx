import * as React from 'react'
import { ItemWithCoinLinkData, CoinLinkData, CoinClickHandler } from '../types'

interface Props {
  itemWithCoinLinkData: ItemWithCoinLinkData
  selectCoin?: CoinClickHandler
  getLink?: (coinData: CoinLinkData) => string
}

const CoinTags = ({ itemWithCoinLinkData, selectCoin, getLink }: Props) => (
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
      const link = getLink ? getLink(data) : undefined

      return (
        <a
          key={index}
          className="tag pointer"
          onClick={onClickHandler}
          href={link}
        >
          {data.symbol}
        </a>
      )
    })}
  </div>
)

export default CoinTags
