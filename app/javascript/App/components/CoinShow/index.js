import React, { Component, Fragment } from 'react'
import { Layout, Card, Button, Menu, Dropdown, Icon, List } from 'antd'
import styled from 'styled-components'
import FlexGrid from './FlexGrid'
import FlexGridItem from './FlexGridItem'
import CoinCharts from './../CoinCharts'
import SearchCoins from './SearchCoins'
import SectionHeader from './../NewsfeedPage/SectionHeader'
import SectionHeaderTight from './../NewsfeedPage/SectionHeaderTight'
import CustomIcon from '../Icon'
import CoinListDrawer from './../NewsfeedPage/CoinListDrawer'

const { Header, Footer, Content } = Layout

export default class CoinShow extends Component {
  state = {
    liveCoinArr: [],
  }
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
        title: 'Market cap',
        value: coinObj.market_cap.usd,
      },
      {
        title: 'Circulating supply',
        value: coinObj.available_supply,
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
    let coinsCollection
    if (this.state.liveCoinArr.length) {
      coinsCollection = this.state.liveCoinArr
    } else {
      coinsCollection = []
      // coinsCollection = this.props.coins
    }

    return (
      <Fragment>
        <Layout>
          <Content>
            <SectionHeader>
              <div className="flex items-center flex-auto">
                <Button
                  onClick={() =>
                    this.props.enableUI('coinListDrawer', { fullScreen: true })
                  }
                >
                  coin list
                </Button>

                <SearchCoins {...this.props} coinShow />
              </div>
            </SectionHeader>

            <ButtonWrap>
              <Dropdown overlay={currencyMenu}>
                <Button style={{ marginLeft: 8, margin: 10 }}>
                  USD <Icon type="down" />
                </Button>
              </Dropdown>
              <Button icon="star">Watch coin</Button>
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
                            title={item.title}
                            description={item.value}
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

            <CoinListDrawer {...this.props} coins={coinsCollection} />
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

const currencyMenu = (
  <Menu>
    <Menu.Item key="1">USD</Menu.Item>
    <Menu.Item key="2">BTC</Menu.Item>
  </Menu>
)

const cardStyle = {
  flexGrow: 1,
}
