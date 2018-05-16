import React from 'react'
import PercentageChange from './PercentageChange'
import Currency from './Currency'

export default ({ coin }) => {
  return (
    <div className="pa3 bb b--light-gray flex justify-between items-center">
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
