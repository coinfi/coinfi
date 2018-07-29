import React, { Component, Fragment } from 'react'
import { Layout, Card, Button, Menu, Dropdown, Icon, Table } from 'antd'
import styled from 'styled-components'
import reqwest from 'reqwest'
import SparkLineTable from './../SparkLineTable.jsx'

const { Header, Footer, Content } = Layout

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (name) => `${name}`,
    width: '20%',
  },
]

class CoinIndex extends Component {
  state = {
    data: [],
    pagination: {},
    loading: false,
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager,
    })
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    })
  }

  fetch = (params = {}) => {
    this.setState({ loading: true })
    reqwest({
      url: '/api/coins.json',
      method: 'get',
      data: {
        results: 10,
        ...params,
      },
      type: 'json',
    }).then((data) => {
      const pagination = { ...this.state.pagination }
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 100 //490
      this.setState({
        loading: false,
        data: data.payload,
        pagination,
      })
    })
  }

  componentDidMount() {
    this.fetch()
  }

  render() {
    let { sortedInfo } = this.state
    sortedInfo = sortedInfo || {}

    const { symbol } = this.props

    const columnNames = [
      {
        title: '#',
        dataIndex: 'ranking',
        key: 'ranking',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, row, index) => {
          return (
            <div style={{ display: 'flex', alignItems: 'left' }}>
              <img
                alt={text}
                src={`https://gitcdn.link/repo/cjdowner/cryptocurrency-icons/master/svg/color/${row.symbol.toLowerCase()}.svg`}
                style={{ width: 35, marginRight: 10 }}
              />
              <div style={{ flexGrow: 1 }}>
                <a href={`/coins/${text.toLowerCase()}`}>{row.symbol}</a>
                <div>{text}</div>
              </div>
            </div>
          )
        },
      },
      {
        title: 'Price',
        dataIndex: 'price.usd',
        key: 'price.usd',
        render: (text, row, index) => {
          return (
            <span>
              {row.market_info.price_usd &&
                row.market_info.price_usd.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
            </span>
          )
        },
      },
      {
        title: 'Market Cap',
        dataIndex: 'market_cap_usd',
        key: 'market_cap_usd',
        render: (text, row, index) => {
          return (
            <span>
              {row.market_info.market_cap_usd &&
                row.market_info.market_cap_usd.toLocaleString('en-US', {
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
        render: (text, row, index) => {
          const percentChange1h = row.market_info.percent_change_1h
          if (percentChange1h > 0) {
            return <span style={{ color: '#12d8b8' }}>{percentChange1h}%</span>
          }
          return <span style={{ color: '#ff6161' }}>{percentChange1h}%</span>
        },
      },
      {
        title: '% Move 1D',
        dataIndex: 'change24h',
        key: 'change24h',
        render: (text, row, index) => {
          const percent24h = row.market_info.percent_change_24h
          if (percent24h > 0) {
            return <span style={{ color: '#12d8b8' }}>{percent24h}%</span>
          }
          return <span style={{ color: '#ff6161' }}>{percent24h}%</span>
        },
      },
      {
        title: '% Move 1W',
        dataIndex: 'change7d',
        key: 'change7d',
        render: (text, row, index) => {
          const percent7d = row.market_info.percent_change_7d
          if (percent7d > 0) {
            return <span style={{ color: '#12d8b8' }}>{percent7d}%</span>
          }
          return <span style={{ color: '#ff6161' }}>{percent7d}%</span>
        },
      },
      {
        title: 'Volume (24hr)',
        dataIndex: 'volume24.usd',
        key: 'volume24.usd',
        render: (text, row, index) => {
          return (
            <span>
              {row.market_info.volume24 &&
                row.market_info.volume24.usd.toLocaleString('en-US', {
                  maximumFractionDigits: 0,
                })}
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

    let colVar = []
    if (window.isDesktop) colVar = columnNames
    if (window.isTablet) colVar = columnNames.slice(0, 7)
    if (window.isMobile) colVar = columnNames.slice(0, 4)

    return (
      <Fragment>
        <Layout>
          <Content>
            <div>
              <div style={{ background: '#fff' }}>
                <Section style={{ float: 'left' }}>
                  <h1>Coins</h1>
                </Section>
                <ButtonWrap>
                  <Dropdown overlay={currencyMenu}>
                    <Button style={{ marginLeft: 8, margin: 10 }}>
                      USD <Icon type="down" />
                    </Button>
                  </Dropdown>
                </ButtonWrap>
                <Section>
                  <Div />
                  <Div />
                </Section>
                <Table
                  columns={colVar}
                  rowKey={(record) => record.id}
                  dataSource={this.state.data}
                  pagination={this.state.pagination}
                  loading={this.state.loading}
                  onChange={this.handleTableChange}
                />
                {/* <Table */}
                {/*   columns={colVar} */}
                {/*   dataSource={this.props.coins} */}
                {/*   onChange={this.handleChange} */}
                {/* /> */}
              </div>
            </div>
          </Content>
          <Footer />
        </Layout>
      </Fragment>
    )
  }
}

export default CoinIndex

const ButtonWrap = styled.div`
  text-align: right;
  margin: 0 1rem;
  @media (min-width: 900px) {
    float: right;
  }
`

const Section = styled.section`
  text-align: center;
  margin: 3rem 0;
  @media (min-width: 900px) {
    text-align: left;
    margin: 0 0 0 1rem;
    padding-top: 1rem;
  }
`

const Div = styled.div`
  margin-bottom: 2rem;
  @media (min-width: 900px) {
    display: inline-block;
    margin-right: 1rem;
  }
`

const Span = styled.span`
  margin: 0 0.5rem;
`

const currencyMenu = (
  <Menu>
    <Menu.Item key="1">USD</Menu.Item>
    <Menu.Item key="2">BTC</Menu.Item>
  </Menu>
)

const cardStyle = {
  flexGrow: 1,
  margin: '1rem .5rem 0 .5rem',
}
