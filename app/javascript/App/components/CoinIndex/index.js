import React, { Component, Fragment } from 'react'
import { Layout, Button, Menu, Dropdown, Icon, Table, Pagination } from 'antd'
import styled from 'styled-components'
import ColumnNames from './ColumnNames'

const { Header, Footer, Content } = Layout

class CoinIndex extends Component {
  state = {
    currency: 'USD',
    priceData: [],
  }

  getPageTotal() {
    return this.props.coinCount
  }

  jumpPage(data) {
    window.location = `/coinsnew?page=${data}`
  }

  changeCurrencyHandler = ({ key }) => {
    this.setState({
      currency: key,
    })
  }

  render() {
    const currencyMenu = (
      <Menu onClick={this.changeCurrencyHandler}>
        <Menu.Item key="USD">USD</Menu.Item>
        <Menu.Item key="BTC">BTC</Menu.Item>
      </Menu>
    )

    return (
      <Fragment>
        <Layout>
          <Header style={{ background: '#fff' }} className="coin-index-header">
            <h1 className="fl">Coins</h1>
            <Dropdown overlay={currencyMenu}>
              <Button className="fr mt3">
                {this.state.currency === 'USD' && 'USD'}
                {this.state.currency === 'BTC' && 'BTC'}
                <Icon type="down" />
              </Button>
            </Dropdown>
          </Header>

          <Content>
            <Table
              rowKey={(record) => record.symbol + record.name}
              columns={ColumnNames(this.state.currency)}
              dataSource={this.props.coins}
              pagination={false}
              scroll={{ x: 1080 }}
            />
          </Content>
          <Footer>
            <Pagination
              defaultCurrent={1}
              total={this.getPageTotal()}
              style={{ textAlign: 'center' }}
              onChange={this.jumpPage}
            />
          </Footer>
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

const cardStyle = {
  flexGrow: 1,
  margin: '1rem .5rem 0 .5rem',
}

const DivHeader = styled.div`
  margin: 1rem;
  padding-top: 10px;
  margin-bottom: 0.5rem;
  @media (min-width: 900px) {
    padding-top: 20px;
    margin-bottom: 4rem;
    padding-left: 1rem;
  }
`

const ContentWrap = styled.div`
  background: #fff;
`
