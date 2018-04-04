import React, { Fragment } from 'react'
import PercentageChange from './PercentageChange'
import Currency from './Currency'

export default props => {
  const coin = props.coin.toJS()
  const { name, image_url, symbol, market_info: info, category } = coin
  return (
    <div className="bg-white shadow-s1 ba b--athens-darker mb3">
      <div className="flex items-end justify-between pa3">
        <div className="flex items-center">
          {image_url && <img className="w2e h2e mr3" src={image_url} alt="" />}
          <h1 className="ma0 lh-solid f3 flex-auto">
            <div className="">
              {name} <span className="f6 fw9 o-50 mb1">{symbol}</span>
            </div>
          </h1>
        </div>
        <div className="f4 fw9 tr">
          {category === 'listed' ? (
            <Fragment>
              <PercentageChange
                number={info.percent_change_24h}
                className="smaller2 b mr2"
              />
              <Currency>{info.price_usd}</Currency>
            </Fragment>
          ) : (
            <Fragment>
              <div className="green">
                <Currency>{coin.ico_usd_raised || 0}</Currency>
              </div>
              <div className="mh2 f7 ttu silver">of</div>
              <div>
                <Currency>{coin.ico_fundraising_goal_usd || 0}</Currency>
              </div>
            </Fragment>
          )}
        </div>
      </div>
      <div className="bt b--athens-dark pa3 pt3">
        {category === 'listed' ? (
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
              <label className="o-60">Market Cap</label>
              {info.market_cap_usd}
              <div className="f7 ml1">USD</div>
            </div>
            <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-3 mt4">
              <label className="o-60">Total Supply</label>
              {info.total_supply}
              <div className="f7 ml1">{symbol}</div>
            </div>
          </div>
        ) : (
          <div className="row mtn4 tr o-90">
            <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-3 mt4">
              <label className="o-60">Total Supply</label>
              {coin.max_supply}
              <div className="f7 ml1">{symbol}</div>
            </div>
            <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-3 mt4">
              <label className="o-60">ICO Price</label>
              {coin.ico_token_price_usd}
              <div className="f7 ml1">USD</div>
            </div>
            <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-3 mt4">
              <label className="o-60">Start Date</label>
              {coin.ico_start_date}
            </div>
            <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-3 mt4">
              <label className="o-60">End Date</label>
              {coin.ico_end_date}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
