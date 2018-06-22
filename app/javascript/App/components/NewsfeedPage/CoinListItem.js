import React from 'react'
import PercentageChange from '../PercentageChange'
import Currency from '../Currency'
import WatchButton from './WatchButton'

export default (props) => {
  const { coin, onClick, isActiveEntity, user } = props
  let klass = 'pa3 b--b flex items-center pointer'
  if (isActiveEntity({ type: 'coin', id: coin.get('id') })) klass += ' bg-foam'
  return (
    <div className={klass}>
      <div className="tooltipped">
        {!user && <div className="tooltip from-right">Login to watch</div>}
        <WatchButton {...props} />
      </div>
      <div
        onClick={() => onClick(coin)}
        className="flex-auto flex justify-between items-center"
      >
        <div className="b f5 pl2">{coin.get('symbol')}</div>
        {coin.get('market_info') && (
          <div className="right-align">
            <Currency>{coin.getIn(['market_info', 'price_usd'])}</Currency>
            <PercentageChange
              value={coin.getIn(['market_info', 'percent_change_24h'])}
              className="smaller2 b db"
            />
          </div>
        )}
      </div>
    </div>
  )
}
