import React, { Component, Fragment } from 'react'
import SparkLineTable from './../SparkLineTable'

export default (currency) => {
  let fixed = false
  if (window.innerWidth < 1000) {
    fixed = true
  }
  return [
    {
      title: '#',
      dataIndex: 'ranking',
      key: 'ranking',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 210,
      fixed,
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
      width: 100,
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
      width: 140,
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
      width: 100,
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
      width: 100,
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
      width: 100,
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
      width: 125,
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
      dataIndex: '',
      key: '',
      render: (text, row, index) => {
        return (
          <SparkLineTable>
            <tbody>
              <tr key={index}>
                <td data-sparkline="71, 78, 39, 66" key={index} />
              </tr>
            </tbody>
          </SparkLineTable>
        )
      },
    },
  ]
}
