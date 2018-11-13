import * as React from 'react'
import * as _ from 'lodash'
import classNames from 'classnames'
import PercentageChange from '~/bundles/common/components/PercentageChange'
import WatchButton from '~/bundles/common/components/WatchButton'
import { Coin } from '~/bundles/common/types'

interface Props {
  coin: Coin
  loggedIn: boolean
  isSelected: boolean
  onSelectCoin: (c: Coin) => void
}

export default (props: Props) => {
  const { coin, loggedIn } = props

  const coinPrice = _.get(coin, ['market_info', 'price_usd'])
  let fixedCount = 0
  if (coinPrice !== undefined) {
    const splitCoinPrice = `#{coinPrice}`.split('.')
    const fraction = splitCoinPrice[1] || ''
    fixedCount =
      !_.isUndefined(fraction) && fraction.length > 3 ? 4 : fraction.length
  }
  const coinPriceFixed = parseFloat(coinPrice).toFixed(fixedCount)
  const percentChange = _.get(coin, ['market_info', 'percent_change_24h'])
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
      <div className="tooltipped">
        {!loggedIn && <div className="tooltip from-right">Login to watch</div>}
        <WatchButton {...props} hasText={false} />
      </div>
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
