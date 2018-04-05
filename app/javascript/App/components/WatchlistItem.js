import React, { Fragment } from 'react'
import PercentageChange from './PercentageChange'
import Currency from './Currency'
import dateFormat from 'dateformat'

export default props => {
  const coin = props.coin.toJS()
  const {
    name,
    image_url,
    symbol,
    market_info: info,
    category,
    slug,
    max_supply,
    ico_token_price_usd,
    ico_start_date,
    ico_end_date
  } = coin
  return (
    <a
      href={`/coins/${slug}`}
      className="bright-gray db bg-white shadow-s1 ba b--athens-darker mb3 tc tl-ns"
    >
      <div className="pa3">
        <div className="row bottom-xs">
          <div className="col-xs-12 col-sm-7 col-md-12 col-lg-7">
            <div className="flex items-center">
              {image_url && (
                <img className="w2e h2e mr3" src={image_url} alt="" />
              )}
              <h1 className="ma0 lh-solid f3">
                <div className="">
                  {name} <span className="f6 fw9 o-50 mb1">{symbol}</span>
                </div>
              </h1>
            </div>
          </div>
          <div className="col-xs-12 col-sm-5 col-md-12 col-lg-5 f4 fw9 tr mt2 mt0-s">
            {category === 'listed' ? (
              <Fragment>
                <PercentageChange
                  number={info.percent_change_24h}
                  className="smaller2 b mr2"
                />
                <Currency>{info.price_usd}</Currency>
              </Fragment>
            ) : (
              <div className="flex items-center justify-end">
                <div className="green">
                  <Currency>{coin.ico_usd_raised || 0}</Currency>
                </div>
                <div className="mh2 f7 ttu silver">of</div>
                <div>
                  <Currency>{coin.ico_fundraising_goal_usd || 0}</Currency>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bt b--athens-dark pa3 pt3">
        {category === 'listed' ? (
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
        ) : (
          <div className="row mtn4 tr o-90">
            <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-3 mt4">
              <label className="o-60">Total Supply</label>
              {max_supply ? (
                <div>
                  {max_supply}
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
                {ico_start_date
                  ? dateFormat(ico_start_date, 'mmm d, yyyy')
                  : '?'}
              </div>
            </div>
            <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-3 mt4">
              <label className="o-60">End Date</label>
              <div className="f6">
                {ico_end_date ? dateFormat(ico_end_date, 'mmm d, yyyy') : '?'}
              </div>
            </div>
          </div>
        )}
      </div>
    </a>
  )
}
