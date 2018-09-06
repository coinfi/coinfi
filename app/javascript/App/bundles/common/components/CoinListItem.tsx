import * as React from 'react'
import { Link } from 'react-router-dom'
import PercentageChange from '~/bundles/common/components/PercentageChange'
import WatchButton from '~/bundles/common/components/WatchButton'
import { ICoin } from '~/bundles/common/types'

interface IProps {
  coin: ICoin
  loggedIn: boolean
}

export default (props: IProps) => {
  const { coin, loggedIn } = props
  const klass = 'pa-default b--b flex items-center pointer'
  // if (isActiveEntity({ type: 'coin', id: coin.get('id') })) klass += ' bg-foam'

  const coinPrice = coin.market_info.price_usd
  let fixedCount = 0
  if (coinPrice !== undefined) {
    fixedCount =
      coinPrice && coinPrice.split('.')[1].length > 3
        ? 4
        : coinPrice.split('.')[1].length
  }
  const coinPriceFixed = parseFloat(coinPrice).toFixed(fixedCount)
  const percentChange = coin.market_info.percent_change_24h
  return (
    // TODO: Change to "Control" component for accessibility.
    <Link
      className={klass}
      to={`/news/${coin.slug}`}
      style={{ minHeight: 57, color: '#555' }}
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
    </Link>
  )
}
