import React from 'react'
import { Link } from 'react-router-dom'
//import PercentageChange from '../../../components/PercentageChange'
import WatchButton from './WatchButton'

export default (props) => {
  const { coin, user, onClick } = props
  let klass = 'pa-default b--b flex items-center pointer'
  //if (isActiveEntity({ type: 'coin', id: coin.get('id') })) klass += ' bg-foam'

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
    <Link className={klass} to={`/news/${coin.slug}`} style={{ minHeight: 57 }}>
      <div className="tooltipped">
        {!user && <div className="tooltip from-right">Login to watch</div>}
        <WatchButton {...props} />
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
            {/*
              <PercentageChange
                value={percentChange}
                className="smaller2 b db"
              />
            */}
          </div>
        )}
      </div>
    </Link>
  )
}
