import React, { Component, Fragment } from 'react'
import {
  Layout,
  Card,
  Button,
  Menu,
  Dropdown,
  Icon,
  List,
  Col,
  Row,
  Table,
} from 'antd'
import styled from 'styled-components'

const { Header, Footer, Content } = Layout

class CoinIndex extends Component {
  render() {
    const { symbol } = this.props

    const columnNames = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Price',
        dataIndex: 'price.usd',
        key: 'price.usd',
      },
      {
        title: 'Market Cap',
        dataIndex: 'market_cap.usd',
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
    if (window.isTablet) colVar = columnNames.slice(0, 6)
    if (window.isMobile) colVar = columnNames.slice(0, 3)

    return (
      <Fragment>
        <Layout>
          <Content>
            <div>
              <div style={{ background: '#fff' }}>
                <h1>Coins</h1>
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

                <div
                  style={{
                    background: '#f6f8fa',
                    padding: '0 .5rem',
                    border: '1px solid #e5e6e6',
                  }}
                >
                  [Overview]
                </div>

                <Table columns={colVar} dataSource={this.props.coins} />
                {/*
                  rowKey={record => record.login.uuid}
                  pagination={this.state.pagination}
                  loading={this.state.loading}
                  onChange={this.handleTableChange}
                  */}
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
    margin-top: 2.5rem;
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
