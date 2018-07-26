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
} from 'antd'
import styled from 'styled-components'
import FlexGrid from './FlexGrid'
import FlexGridItem from './FlexGridItem'
import CoinCharts from './../CoinCharts'
import SearchCoins from './SearchCoins'
import SectionHeader from './../NewsfeedPage/SectionHeader'
import SectionHeaderTight from './../NewsfeedPage/SectionHeaderTight'
import CustomIcon from '../Icon'
import CoinListDrawer from './../NewsfeedPage/CoinListDrawer'
import CoinList from './../NewsfeedPage/CoinList'
import newsfeedContainer from './../../containers/newsfeed'

const { Header, Footer, Content } = Layout

class CoinShow extends Component {
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
      coinsCollection = this.props.coins
    }

    return (
      <Fragment>
        <Layout>
          <Content>
            {window.isDesktop && (
              <div style={{ width: 200, float: 'left', background: '#fff' }}>
                <CoinList {...this.props} />
              </div>
            )}
            <div style={window.isDesktop ? { marginLeft: 210 } : {}}>
              <SectionHeader>
                <HideLarge>
                  <Button
                    type="primary"
                    icon="bars"
                    onClick={() =>
                      this.props.enableUI('coinListDrawer', {
                        fullScreen: true,
                      })
                    }
                  >
                    Coin List
                  </Button>
                </HideLarge>

                <SearchCoins {...this.props} coinShow />
              </SectionHeader>

              <div style={{ background: '#fff' }}>
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
                      height="56"
                      src={coinObj.image_url}
                      width="56"
                    />
                  </Div>
                  <Div>
                    <Span style={{ fontSize: 20, fontWeight: 'bold' }}>
                      {coinObj.name}
                    </Span>
                    <Span style={{ fontSize: 16 }}>{symbol}</Span>
                  </Div>
                  <Div>
                    <Span style={{ fontSize: 18, fontWeight: 'bold' }}>
                      ${coinObj.price.usd}
                    </Span>
                    <Span style={{ fontSize: 14 }}>{coinObj.change1h}%</Span>
                  </Div>
                </Section>

                <div
                  style={{
                    background: '#f6f8fa',
                    padding: '0 .5rem',
                    border: '1px solid #e5e6e6',
                  }}
                >
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
                </div>
              </div>
            </div>
            <CoinListDrawer {...this.props} coins={coinsCollection} />
          </Content>
          <Footer />
        </Layout>
      </Fragment>
    )
  }
}

export default newsfeedContainer(CoinShow)

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

const HideLarge = styled.div`
  @media (min-width: 900px) {
    display: none;
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
  margin: '1rem .5rem 0 .5rem',
}
