import React from 'react'

export default (coinObj, currency) => {
  return [
    {
      title: 'Market Cap',
      value: `${coinObj.market_cap.usd.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })} USD`,
    },
    {
      title: '24HR',
      value: (
        <span
          style={
            coinObj.change24h > 0 ? { color: '#12d8b8' } : { color: '#ff6161' }
          }
        >
          {coinObj.change24h.toLocaleString('en-US')}%
        </span>
      ),
    },
    {
      title: '7D',
      value: (
        <span
          style={
            coinObj.change7d > 0 ? { color: '#12d8b8' } : { color: '#ff6161' }
          }
        >
          {coinObj.change7d.toLocaleString('en-US')}%
        </span>
      ),
    },
    {
      title: 'Circulating Supply',
      value: `${coinObj.available_supply.toLocaleString('en-US')} ${
        coinObj.symbol
      }`,
    },
  ]
}
