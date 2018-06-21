import React from 'react'
import CoinCharts from '../CoinCharts'
import Currency from '../Currency'
import PercentageChange from '../PercentageChange'
import WatchButton from './WatchButton'
import LoadingIndicator from '../LoadingIndicator'

const CoinBody = (props) => {
  const { selectCoinDetails, activeEntity, isLoading } = props
  let coin = selectCoinDetails(activeEntity.id)
  if (!coin && isLoading('coin'))
    return <LoadingIndicator className="overlay bg-white-70" />
  return (
    <div className="pa4 bg-white">
      <div className="flex justify-between items-center">
        <a
          href={`/coins/${coin.get('slug')}`}
          className="f4 fw6 flex items-center color-inherit"
        >
          {coin.get('image_url') && (
            <img className="w2e h2e mr3" src={coin.get('image_url')} alt="" />
          )}
          {coin.get('name')}
          <span className="ml2">({coin.get('symbol')})</span>
        </a>
        <div>
          <WatchButton {...props} coin={coin} />
        </div>
      </div>
      <div className="min-h12e flex items-center justify-center">
        <div className="tc">
          <div className="flex items-center">
            <span className="f2">
              <Currency>{coin.getIn(['market_info', 'price_usd'])}</Currency>
            </span>
            <span className="ml2">
              <PercentageChange
                value={coin.getIn(['market_info', 'percent_change_24h'])}
                className="b db"
              />
            </span>
          </div>
          <div className="dib ph2 pv1 bg-light-gray f6 mt2">
            {`Market: ${coin.getIn(['market_info', 'market_cap_usd'])}`}
          </div>
        </div>
      </div>
      <CoinCharts
        symbol={coin.get('symbol')}
        priceData={coin.get('prices_data').toJS()}
        newsItems={coin.get('news_data').toJS()}
        isTradingViewVisible={activeEntity.type !== 'coin'}
      />
    </div>
  )
}

export default CoinBody
