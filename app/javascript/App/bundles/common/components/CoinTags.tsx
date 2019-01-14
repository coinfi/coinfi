import * as React from 'react'
import * as _ from 'lodash'
import { ItemWithCoinLinkData, CoinLinkData, CoinClickHandler } from '../types'

interface Props {
  itemWithCoinLinkData: ItemWithCoinLinkData
  onClick?: CoinClickHandler
  getLink?: (coinData: CoinLinkData) => string
}

const CoinTags = ({ itemWithCoinLinkData, onClick, getLink }: Props) => {
  const linkData = _.get(
    itemWithCoinLinkData,
    'coin_link_data',
    [] as CoinLinkData[],
  )
  return (
    <div>
      {linkData.map((data, index) => {
        const isClickable = !!onClick
        const onClickHandler = isClickable
          ? (e) => {
              e.preventDefault()
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
              onClick(data)
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
}

export default CoinTags
