import React from 'react'

const CoinListSearchItem = ({ coin }) => {
  return (
    <div>
      <div className="flex items-center">
        {coin.get('image_url') && (
          <img className="w2e h2e mr3" src={coin.get('image_url')} alt="" />
        )}
        {coin.get('name')}
        <span className="b ml2 f7">{coin.get('symbol')}</span>
      </div>
    </div>
  )
}

export default CoinListSearchItem
