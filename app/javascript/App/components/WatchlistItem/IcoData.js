import React from 'react'
import dateFormat from 'dateformat'
import numeral from 'numeral'

export default ({ coin }) => {
  const { max_supply, symbol, ico_token_price_usd } = coin
  let { ico_start_date: start, ico_end_date: end } = coin
  if (start) start = new Date(start * 1000)
  if (end) end = new Date(end * 1000)
  return (
    <div className="row nt4 tr o-90">
      <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-3 mt4">
        <label className="o-60">Total Supply</label>
        {max_supply ? (
          <div>
            {numeral(max_supply || 0).format('0.0a').toUpperCase()}
            <div className="f7 ml1">{symbol}</div>
          </div>
        ) : (
          '?'
        )}
      </div>
      <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-3 mt4">
        <label className="o-60">ICO Price</label>
        {ico_token_price_usd ? (
          <div>
            {ico_token_price_usd}
            <div className="f7 ml1">USD</div>
          </div>
        ) : (
          '?'
        )}

      </div>
      <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-3 mt4">
        <label className="o-60">Start Date</label>
        <div className="f6">
          {start ? dateFormat(start, 'mmm d, yyyy') : '?'}
        </div>
      </div>
      <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-3 mt4">
        <label className="o-60">End Date</label>
        <div className="f6">{end ? dateFormat(end, 'mmm d, yyyy') : '?'}</div>
      </div>
    </div>
  )
}
