import React from 'react'
import PercentageChange from './PercentageChange'
import Currency from './Currency'

export default ({ coin }) => {
  const { name, image_url, symbol, market_info: info, category } = coin.toJS()
  return (
    <div className="bg-white shadow-s1 ba b--athens-darker mb3">
      <div className="flex items-end justify-between pa3">
        <div className="flex items-center">
          {image_url && (
            <img className="w2e h2e mr3" src={image_url} alt={name} />
          )}
          <h1 className="ma0 lh-solid f3 flex-auto">
            <div className="">{name} <span className="f6 fw9 o-50 mb1">{symbol}</span></div>
          </h1>
        </div>
        <div className="f4 fw9 tr">
          <PercentageChange
            number={info.percent_change_24h}
            className="smaller2 b mr2"
          />
          <Currency>{info.price_usd}</Currency>
        </div>
      </div>
      {category === 'listed' && (
        <div className="bt b--athens-dark pa3 pt3">
          <div className="row mtn4 tr o-90">
            <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-3 mt4">
              <label className="o-60">Volume</label>
              {info['24h_volume_usd']}
              <div className="f7 ml1">USD</div>
            </div>
            <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-3 mt4">
              <label className="o-60">Circulation</label>
              {info.available_supply}
              <div className="f7 ml1">{symbol}</div>
            </div>
            <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-3 mt4">
              <label className="o-60">Market cap</label>
              {info.market_cap_usd}
              <div className="f7 ml1">USD</div>
            </div>
            <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-3 mt4">
              <label className="o-60">Total supply</label>
              {info.total_supply}
              <div className="f7 ml1">{symbol}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
