import React, { Component, Fragment } from 'react'
import { Layout, Card, Button, Tabs, Menu, Dropdown, Icon, List } from 'antd'
import styled from 'styled-components'
import FlexGrid from './FlexGrid'
import FlexGridItem from './FlexGridItem'
import CoinCharts from './../CoinCharts'

const TabPane = Tabs.TabPane
const { Header, Footer, Content } = Layout

export default class CoinShow extends Component {
  render() {
    const {
      symbol,
      priceData,
      annotations,
      isTradingViewVisible,
      coinObj,
    } = this.props
    const fundamentalsData = [
      {
        'Market cap': coinObj.market_cap.usd,
      },
      {
        'Circulating supply': coinObj.available_supply,
      },
    ]
    const linksData = [
      {
        Website: coinObj.website,
      },
      {
        Whitepaper: coinObj.Whitepaper,
      },
      {
        Explorer: coinObj.explorer,
      },
      {
        Twitter: coinObj.twitter,
      },
      {
        Github: coinObj.github,
      },
    ]

    return (
      <Fragment>
        <Layout>
          <Content>
            <ButtonWrap>
              <Dropdown overlay={menu}>
                <Button style={{ marginLeft: 8, margin: 10 }}>
                  USD <Icon type="down" />
                </Button>
              </Dropdown>
              <Button>Watch coin</Button>
            </ButtonWrap>
            <Section>
              <Div>
                <img
                  alt={coinObj.name}
                  height="32"
                  src={coinObj.image_url}
                  width="32"
                />
              </Div>
              <Div>
                <span>{coinObj.name}</span> <span>{symbol}</span>
              </Div>
              <Div>
                <span>{coinObj.price.usd}</span>
                <span>{coinObj.change1h}</span>
              </Div>
            </Section>

            <Tabs defaultActiveKey="1">
              <TabPane tab="Overview" key="1">
                <FlexGrid>
                  <FlexGridItem colWidth={2}>
                    <Card title="Price chart" style={cardStyle}>
                      <CoinCharts
                        symbol={symbol}
                        priceData={priceData}
                        annotations={annotations}
                        isTradingViewVisible={isTradingViewVisible}
                      />
                    </Card>
                  </FlexGridItem>
                  <FlexGridItem>
                    <Card title="Fundamentals" style={cardStyle}>
                      <List
                        itemLayout="horizontal"
                        dataSource={fundamentalsData}
                        renderItem={(item) => {
                          return (
                            <List.Item>
                              <List.Item.Meta
                                title={Object.keys(item)[0]}
                                description={item[Object.keys(item)[0]]}
                              />
                            </List.Item>
                          )
                        }}
                      />
                    </Card>
                  </FlexGridItem>
                  <FlexGridItem>
                    <Card title="Links" style={cardStyle}>
                      <List
                        itemLayout="horizontal"
                        dataSource={linksData}
                        renderItem={(item) => {
                          return (
                            <List.Item>
                              <List.Item.Meta
                                title={Object.keys(item)[0]}
                                description={item[Object.keys(item)[0]]}
                              />
                            </List.Item>
                          )
                        }}
                      />
                    </Card>
                  </FlexGridItem>
                </FlexGrid>
              </TabPane>
              <TabPane tab="Markets" key="2">
                <Card title="Funds raised" />
                <Card title="Summary" />
                <Card title="Ratings" />
                <Card title="Links" />
              </TabPane>
            </Tabs>
          </Content>
          <Footer />
        </Layout>
      </Fragment>
    )
  }
}

const ButtonWrap = styled.div`
  text-align: right;
  margin: 1rem;
`

const Section = styled.section`
  text-align: center;
  @media (min-width: 900px) {
    text-align: left;
  }
`

const Div = styled.div`
  @media (min-width: 900px) {
    display: inline-block;
  }
`

const menu = (
  <Menu>
    <Menu.Item key="1">USD</Menu.Item>
    <Menu.Item key="2">BTC</Menu.Item>
  </Menu>
)

const cardStyle = {
  flexGrow: 1,
}
