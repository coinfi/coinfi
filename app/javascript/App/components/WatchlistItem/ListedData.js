import React from 'react'

export default ({ coin }) => {
  const { market_info: info, symbol } = coin
  return (
    <div className="row mtn4 tc tr-l o-90">
      <div className="stat-block col-xs-6 col-sm-3 col-md-6 col-lg-3 mt4">
        <label className="o-60">Volume</label>
        {info['24h_volume_usd']}
        <div className="f7 ml1">USD</div>
      </div>
      <div className="stat-block col-xs-6 col-sm-3 col-md-6 col-lg-3 mt4">
        <label className="o-60">Circulation</label>
        {info.available_supply}
        <div className="f7 ml1">{symbol}</div>
      </div>
      <div className="stat-block col-xs-6 col-sm-3 col-md-6 col-lg-3 mt4">
        <label className="o-60">Market Cap</label>
        {info.market_cap_usd}
        <div className="f7 ml1">USD</div>
      </div>
      <div className="stat-block col-xs-6 col-sm-3 col-md-6 col-lg-3 mt4">
        <label className="o-60">Total Supply</label>
        {info.total_supply}
        <div className="f7 ml1">{symbol}</div>
      </div>
    </div>
  )
}
