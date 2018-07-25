import React, { Component, Fragment } from 'react'
import { Layout, Card, Button, Menu, Dropdown, Icon, Table } from 'antd'
import styled from 'styled-components'

const { Header, Footer, Content } = Layout

class CoinIndex extends Component {
  state = {
    sortedInfo: null,
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter,
    })
  }

  clearAll = () => {
    this.setState({
      sortedInfo: null,
    })
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
      },
      {
        title: 'Price',
        dataIndex: 'price.usdFmt',
        key: 'price.usd',
        sorter: (a, b) => a.price.usd - b.price.usd,
        sortOrder: sortedInfo.columnKey === 'price.usd' && sortedInfo.order,
      },
      {
        title: 'Market Cap',
        dataIndex: 'market_cap.usdFmt',
        key: 'market_cap.usd',
        sorter: (a, b) => a.market_cap.usd - b.market_cap.usd,
        sortOrder:
          sortedInfo.columnKey === 'market_cap.usd' && sortedInfo.order,
      },
      {
        title: '% Move 1H',
        dataIndex: 'change1h',
        key: 'change1h',
        sorter: (a, b) => a.change1h.usd - b.change1h.usd,
        sortOrder: sortedInfo.columnKey === 'change1h.usd' && sortedInfo.order,
      },
      {
        title: '% Move 1D',
        dataIndex: 'change24h',
        key: 'change24h',
        sorter: (a, b) => a.change1h.usd - b.change1h.usd,
        sortOrder: sortedInfo.columnKey === 'change1h.usd' && sortedInfo.order,
      },
      {
        title: '% Move 1W',
        dataIndex: 'change7d',
        key: 'change7d',
        sorter: (a, b) => a.change7d.usd - b.change7d.usd,
        sortOrder: sortedInfo.columnKey === 'change7d.usd' && sortedInfo.order,
      },
      {
        title: 'Volume (24hr)',
        dataIndex: 'volume24.usd',
        key: 'volume24.usd',
        sorter: (a, b) => a.volume24.usd - b.volume24.usd,
        sortOrder: sortedInfo.columnKey === 'volume24.usd' && sortedInfo.order,
      },
      {
        title: '7D Chart',
        dataIndex: '',
        key: '',
      },
    ]

    let colVar = []
    if (window.isDesktop) colVar = columnNames
    if (window.isTablet) colVar = columnNames.slice(0, 7)
    if (window.isMobile) colVar = columnNames.slice(0, 4)

    const coinsLocale = this.props.coins.map((item) => {
      const formattedNum = item.market_cap.usd.toLocaleString('en-US', {
        maximumFractionDigits: 0,
      })
      const formattedPrice = item.price.usd.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
      item.market_cap.usdFmt = formattedNum
      item.price.usdFmt = formattedPrice
      return item
    })

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
                  dataSource={this.props.coins}
                  onChange={this.handleChange}
                />
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
