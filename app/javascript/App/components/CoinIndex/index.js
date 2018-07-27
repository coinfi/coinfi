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
      },
      {
        title: 'Market Cap',
        dataIndex: 'market_cap.usdFmt',
        key: 'market_cap.usd',
      },
      {
        title: '% Move 1H',
        dataIndex: 'change1h',
        key: 'change1h',
      },
      {
        title: '% Move 1D',
        dataIndex: 'change24h',
        key: 'change24h',
      },
      {
        title: '% Move 1W',
        dataIndex: 'change7d',
        key: 'change7d',
      },
      {
        title: 'Volume (24hr)',
        dataIndex: 'volume24.usd',
        key: 'volume24.usd',
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
