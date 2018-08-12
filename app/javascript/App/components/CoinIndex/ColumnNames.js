import React from 'react'
import RedGreenSpan from './RedGreenSpan'
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
        const slug = row.symbol.toLowerCase().replace(/ /, '-')
        return (
          <div className="b--r">
            <img alt={text} src={row.image_url} className="fl mr2" />
            <div className="fl">
              <a href={`/coinsnew/${slug}`}>{row.symbol}</a>
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
        if (currency === 'USD' && row.price) {
          return <span>${row.price[currencyKey]} USD</span>
        }
        if (currency === 'BTC' && row.price) {
          return <span>{row.price[currencyKey]} &#579;</span>
        }
      },
    },
    {
      title: 'Market Cap',
      dataIndex: 'market_cap.usd',
      align: 'right',
      render: (text, row, index) =>
        text ? (
          <span>
            ${text.toLocaleString('en-US', {
              maximumFractionDigits: 0,
            })}
          </span>
        ) : null,
    },
    {
      title: '% Move 1H',
      dataIndex: 'change1h',
      align: 'right',
      render: (text, row, index) => <RedGreenSpan text={text} affix="%" />,
    },
    {
      title: '% Move 1D',
      dataIndex: 'change24h',
      align: 'right',
      render: (text, row, index) => <RedGreenSpan text={text} affix="%" />,
    },
    {
      title: '% Move 1W',
      dataIndex: 'change7d',
      align: 'right',
      render: (text, row, index) => <RedGreenSpan text={text} affix="%" />,
    },
    {
      title: 'Volume (24hr)',
      dataIndex: 'volume24.usd',
      align: 'right',
      render: (text, row, index) =>
        text ? (
          <span>
            {text.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </span>
        ) : null,
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
