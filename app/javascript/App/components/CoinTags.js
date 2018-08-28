import React from 'react'

const CoinTags = ({ itemWithCoinLinkData, selectCoin }) => (
  <div>
    {itemWithCoinLinkData.get('coin_link_data').map((data, index) => (
      <button
        key={index}
        className="tag pointer btn-reset pa0"
        onClick={() => selectCoin(data)}
      >
        {data.get('symbol')}
      </button>
    ))}
  </div>
)

export default CoinTags
