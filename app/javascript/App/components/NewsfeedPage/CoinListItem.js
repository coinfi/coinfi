import React from 'react'
import PercentageChange from '../PercentageChange'
import Currency from '../Currency'

export default ({ coin, setCurrentEntity, activeEntity }) => {
  let klass = 'pa3 bb b--light-gray flex justify-between items-center pointer'
  if (
    activeEntity &&
    activeEntity.type === 'coin' &&
    activeEntity.id === coin.get('id')
  )
    klass += ' bg-foam'
  return (
    <div
      onClick={() => setCurrentEntity({ type: 'coin', id: coin.get('id') })}
      className={klass}
    >
      <div className="b f5">{coin.get('symbol')}</div>
      <div className="right-align">
        <Currency>{coin.getIn(['market_info', 'price_usd'])}</Currency>
        <PercentageChange
          number={coin.getIn(['market_info', 'percent_change_24h'])}
          className="smaller2 b db"
        />
      </div>
    </div>
  )
}
