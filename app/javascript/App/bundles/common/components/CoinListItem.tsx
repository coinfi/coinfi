import * as React from 'react'
import classNames from 'classnames'
import PercentageChange from '~/bundles/common/components/PercentageChange'
import WatchStar from '~/bundles/common/components/WatchStar'
import { Coin } from '~/bundles/common/types'

interface Props {
  coin: Coin
  loggedIn: boolean
  isSelected: boolean
  onSelectCoin: (c: Coin) => void
}

const roundToDecimalPlaces = (num, places) =>
  Math.round(num * 10 ** places) / 10 ** places

export default (props: Props) => {
  const { coin, loggedIn } = props

  const coinPrice = coin.market_info.price_usd
  const coinPriceFixed = roundToDecimalPlaces(coinPrice, 4)
  const percentChange = coin.market_info.percent_change_24h
  return (
    <a
      href={`/news/${coin.slug}`}
      className={classNames('pa-default b--b flex items-center pointer', {
        'bg-foam': props.isSelected,
      })}
      style={{ minHeight: 57, color: '#555' }}
      onClick={(event) => {
        event.preventDefault()
        props.onSelectCoin(coin)
      }}
    >
      <WatchStar coin={coin} hasText={false} loggedIn={loggedIn} />
      <div className="flex-auto flex justify-between items-center">
        <div className="b f5 pl2">{coin.symbol}</div>
        {coin.market_info && (
          <div className="right-align">
            {coinPrice && (
              <div>
                $<span>{coinPriceFixed}</span>
              </div>
            )}
            {coinPrice ? null : <div className="smaller3">UNLISTED</div>}
            <PercentageChange value={percentChange} className="smaller2 b db" />
          </div>
        )}
      </div>
    </a>
  )
}
