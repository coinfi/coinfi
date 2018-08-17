import React from 'react'
import { Sparklines, SparklinesLine } from 'react-sparklines'

export default (currency) => {
  return [
    {
      title: '#',
      dataIndex: 'ranking',
      fixed: 'left',
      align: 'right',
      width: 64,
    },
    {
      title: 'Coin',
      dataIndex: 'name',
      fixed: 'left',
      width: 240,
      render: (text, row, index) => {
        return (
          <div className="b--r">
            <img alt={text} src={row.image_url} className="fl mr2" />
            <div className="fl">
              <a href={`/coinsnew/${text.toLowerCase().replace(/ /, '-')}`}>
                {row.symbol}
              </a>
              <div>{text}</div>
            </div>
          </div>
        )
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      align: 'right',
      render: (text, row, index) => {
        const currencyKey = currency.toLowerCase()
        if (currency === 'USD') {
          return <span>${row.price[currencyKey]}</span>
        }
        if (currency === 'BTC') {
          return <span>{row.price[currencyKey]} &#579;</span>
        }
      },
    },
    {
      title: 'Market Cap',
      dataIndex: 'market_cap.usd',
      align: 'right',
      render: (text, row, index) => {
        return (
          <span>
            ${text.toLocaleString('en-US', {
              maximumFractionDigits: 0,
            })}
          </span>
        )
      },
    },
    {
      title: '% Move 1H',
      dataIndex: 'change1h',
      align: 'right',
      render: (text, row, index) => {
        if (text > 0) {
          return <span style={{ color: '#12d8b8' }}>{text}%</span>
        }
        return <span style={{ color: '#ff6161' }}>{text}%</span>
      },
    },
    {
      title: '% Move 1D',
      dataIndex: 'change24h',
      align: 'right',
      render: (text, row, index) => {
        if (text > 0) {
          return <span style={{ color: '#12d8b8' }}>{text}%</span>
        }
        return <span style={{ color: '#ff6161' }}>{text}%</span>
      },
    },
    {
      title: '% Move 1W',
      dataIndex: 'change7d',
      align: 'right',
      render: (text, row, index) => {
        if (text > 0) {
          return <span style={{ color: '#12d8b8' }}>{text}%</span>
        }
        return <span style={{ color: '#ff6161' }}>{text}%</span>
      },
    },
    {
      title: 'Volume (24hr)',
      dataIndex: 'volume24.usd',
      align: 'right',
      render: (text, row, index) => {
        return (
          <span>
            {text.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </span>
        )
      },
    },
    {
      title: '7D Chart',
      dataIndex: 'sparkline',
      align: 'right',
      render: (text, row, index) => {
        return (
          <Sparklines data={text}>
            <SparklinesLine />
          </Sparklines>
        )
      },
    },
  ]
}
