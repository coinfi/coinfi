import React from 'react'
import PercentageChange from './PercentageChange'
import Currency from './Currency'

export default ({ coin }) => {
  const { name, image_url, symbol, market_info: info, category } = coin
  return (
    <div className="bb b--athens-dark">
      <div className="pa4 flex flex-column items-center">
        <div className="flex items-center mb3">
          {image_url && (
            <img className="w4e mr3 a1" src={image_url} alt={name} />
          )}
          <h1 className="ma0 lh-solid">
            <span className="fw4">{name}</span>
            <span className="ml3 f6 fw9 arial">{symbol}</span>
          </h1>
        </div>
        <div className="f3">
          <Currency>{info.price_usd}</Currency>
          <PercentageChange
            number={info.percent_change_24h}
            className="smaller2 b ml2"
          />
        </div>
      </div>
      {category === 'listed' && (
        <div className="bg-athens-dark pa3">
          <div className="row mtn4">
            <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-6 mt4">
              <label>Volume</label>
              {info['24h_volume_usd']}
              <span className="dib f7 ml1">USD</span>
            </div>
            <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-6 mt4">
              <label>Circulation</label>
              {info.available_supply}
              <span className="dib f7 ml1">{symbol}</span>
            </div>
            <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-6 mt4">
              <label>Market cap</label>
              {info.market_cap_usd}
              <span className="dib f7 ml1">USD</span>
            </div>
            <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-6 mt4">
              <label>Total supply</label>
              {info.total_supply}
              <span className="dib f7 ml1">{symbol}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
