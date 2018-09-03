import * as React from 'react'
import { IItemWithCoinLinkData } from '../types'

interface IProps {
  itemWithCoinLinkData: IItemWithCoinLinkData
  // selectCoin: (CoinLinkData) => void, // FIXME
}

const CoinTags = ({ itemWithCoinLinkData /*selectCoin*/ }: IProps) => (
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
