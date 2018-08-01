import React, { Component, Fragment } from 'react'
import {
  Layout,
  Card,
  Button,
  Menu,
  Dropdown,
  Icon,
  Table,
  Pagination,
} from 'antd'
import styled from 'styled-components'
import ColumnNames from './ColumnNames'

const { Header, Footer, Content } = Layout

class CoinIndex extends Component {
  getPageTotal() {
    //todo: get total page count from header
    return 160
  }
  jumpPage(data) {
    window.location = `/coinsnew?page=${data}`
  }
  render() {
    const { symbol } = this.props

    let colVar = []
    if (window.isDesktop) colVar = ColumnNames()
    if (window.isTablet) colVar = ColumnNames().slice(0, 7)
    if (window.isMobile) colVar = ColumnNames().slice(0, 3)

    return (
      <Fragment>
        <Layout>
          <Content>
            <div style={{ marginTop: -17 }}>
              <ContentWrap>
                <DivHeader>
                  <h1 style={{ float: 'left', marginTop: 4 }}>Coins</h1>
                  <ButtonWrap>
                    <Dropdown overlay={currencyMenu}>
                      <Button style={{ marginLeft: 8, margin: 10 }}>
                        USD <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </ButtonWrap>
                </DivHeader>
                <Table
                  rowKey={(record) => record.symbol + record.name}
                  columns={colVar}
                  dataSource={this.props.coins}
                  pagination={false}
                />
              </ContentWrap>
            </div>
            <Pagination
              defaultCurrent={1}
              total={this.getPageTotal()}
              style={{ textAlign: 'center', margin: '1rem' }}
              onChange={this.jumpPage}
            />
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
