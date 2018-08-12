import React from 'react'

export default (coinObj, currency) => {
  let columns = []
  if (coinObj.market_cap && coinObj.market_cap.usd) {
    columns.push({
      title: 'Market Cap',
      value: `${coinObj.market_cap.usd.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })} USD`,
    })
  }
  if (coinObj.change24h) {
    columns.push({
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
    })
  }
  if (coinObj.change7d) {
    columns.push({
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
    })
  }
  if (coinObj.available_supply) {
    columns.push({
      title: 'Circulating Supply',
      value: `${coinObj.available_supply.toLocaleString('en-US')} ${
        coinObj.symbol
      }`,
    })
  }

  return columns
}
