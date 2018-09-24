import * as React from 'react'
import { ItemWithCoinLinkData } from '../types'

interface Props {
  itemWithCoinLinkData: ItemWithCoinLinkData
  // selectCoin: (CoinLinkData) => void, // FIXME
}

const CoinTags = ({ itemWithCoinLinkData /*selectCoin*/ }: Props) => (
  <div>
    {itemWithCoinLinkData.coin_link_data.map((data, index) => (
      <a
        key={index}
        className="tag pointer" /* onClick={() => selectCoin(data)}*/
      >
        {data.symbol}
      </a>
    ))}
  </div>
)

export default CoinTags
