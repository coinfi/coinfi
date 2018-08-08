import React from 'react'
//import SparkLineTable from './../SparkLineTable'

export default (currency) => {
  let fixed = true
  return [
    {
      title: '#',
      dataIndex: 'ranking',
      key: 'ranking',
      fixed,
      align: 'right',
    },
    {
      title: 'Coin',
      dataIndex: 'name',
      key: 'name',
      fixed,
      align: 'left',
      render: (text, row, index) => {
        return (
          <div style={{ display: 'flex', alignItems: 'left' }}>
            <div
              alt={text}
              style={{
                ...{
                  width: 35,
                  marginRight: 10,
                },
                ...{
                  background: `url('https://gitcdn.link/repo/cjdowner/cryptocurrency-icons/master/svg/color/${row.symbol.toLowerCase()}.svg') no-repeat`,
                },
              }}
            />
            <div style={{ flexGrow: 1 }}>
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
      dataIndex: 'price[currency]',
      key: 'price[currency]',
      align: 'right',
      render: (text, row, index) => {
        if (currency === 'USD') {
          return (
            <span>
              {row.price[currency.toLowerCase()].toLocaleString('en-US', {
                style: 'currency',
                currency: currency,
              })}
            </span>
          )
        }
        if (currency === 'BTC') {
          return <span>{row.price[currency.toLowerCase()]}</span>
        }
      },
    },
    {
      title: 'Market Cap',
      dataIndex: 'market_cap.usd',
      key: 'market_cap.usd',
      align: 'right',
      render: (text, row, index) => {
        return (
          <span>
            {text.toLocaleString('en-US', {
              maximumFractionDigits: 0,
            })}
          </span>
        )
      },
    },
    {
      title: '% Move 1H',
      dataIndex: 'change1h',
      key: 'change1h',
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
      key: 'change24h',
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
      key: 'change7d',
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
      key: 'volume24.usd',
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
      dataIndex: 'priceData',
      key: 'priceData',
      render: (text, row, index) => {
        const num =
          row.priceData && row.priceData.toString().replace(/,/g, ', ')
        return <div />
      },
    },
  ]
}
/*
          <SparkLineTable>
            <tbody>
              <tr key={index}>
                <td data-sparkline={num} key={index} />
              </tr>
            </tbody>
          </SparkLineTable>
*/
