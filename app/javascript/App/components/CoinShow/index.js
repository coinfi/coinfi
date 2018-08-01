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
import axios from 'axios'
import FlexGrid from './../shared/FlexGrid'
import FlexGridItem from './../shared/FlexGridItem'
import SearchCoins from './../shared/SearchCoins'
import CoinCharts from './../CoinCharts'
import SectionHeader from './../shared/SectionHeader'
import SectionHeaderTight from './../shared/SectionHeaderTight'
import CustomIcon from '../Icon'
import CoinListDrawer from './../shared/CoinListDrawer'
import CoinList from './../shared/CoinList'
import newsfeedContainer from './../../containers/newsfeed'
import FundamentalsData from './FundamentalsData'
import LinksData from './LinksData'

const { Header, Footer, Content } = Layout

class CoinShow extends Component {
  state = {
    liveCoinArr: [],
    currency: 'USD',
    watched: false,
  }

  watchlistHandler(coin) {
    window.location = `/coins/${coin
      .get('name')
      .replace(/ /, '-')
      .toLowerCase()}`
  }

  watchCoinHandler = () => {
    this.setState({
      watched: !this.state.watched,
    })
    axios
      .patch('/api/user', { watchCoin: this.props.coinObj.id })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  changeCurrencyHandler = ({ key }) => {
    this.setState({
      currency: key,
    })
  }

  render() {
    const {
      symbol,
      priceData,
      annotations,
      isTradingViewVisible,
      coinObj,
    } = this.props

    let coinsCollection
    if (this.state.liveCoinArr.length) {
      coinsCollection = this.state.liveCoinArr
    } else {
      coinsCollection = this.props.coins
    }

    const percentChange1h = {
      positive: coinObj.change1h > 0,
      value: coinObj.change1h,
    }

    const currencyMenu = (
      <Menu onClick={this.changeCurrencyHandler}>
        <Menu.Item key="USD">USD</Menu.Item>
        <Menu.Item key="BTC">BTC</Menu.Item>
      </Menu>
    )

    return (
      <Fragment>
        <Layout>
          <Content>
            {window.isDesktop && (
              <div
                style={{
                  width: 200,
                  float: 'left',
                  background: '#fff',
                  borderRight: '1px solid #e8e8e8',
                }}
              >
                <CoinList
                  {...this.props}
                  watchlistHandler={this.watchlistHandler}
                />
              </div>
            )}
            <div style={window.isDesktop ? { marginLeft: 200 } : {}}>
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
                    style={{ marginRight: '1rem' }}
                  >
                    Coin List
                  </Button>
                </HideLarge>

                <SearchCoins {...this.props} coinShow />
              </SectionHeader>

              <div style={{ background: '#fff' }}>
                <ButtonWrap>
                  <Dropdown overlay={currencyMenu}>
                    <Button size="small" style={{ marginLeft: 8, margin: 10 }}>
                      USD <Icon type="down" />
                    </Button>
                  </Dropdown>
                  <Button
                    icon="star"
                    size="small"
                    type="primary"
                    onClick={this.watchCoinHandler}
                    ghost={this.state.watched}
                    loading={false}
                  >
                    Watch coin
                  </Button>
                </ButtonWrap>
                <Section>
                  <Div>
                    <img
                      alt={coinObj.name}
                      src={coinObj.image_url}
                      height={!window.isMobile ? '35' : '55'}
                      width={!window.isMobile ? '35' : '55'}
                    />
                  </Div>
                  <Div marginBottom>
                    <Span style={{ fontSize: 20, fontWeight: 'bold' }}>
                      {coinObj.name}
                    </Span>
                    <Span style={{ fontSize: 16 }}>{symbol}</Span>
                  </Div>
                  <Div>
                    <Span style={{ fontSize: 18, fontWeight: 'bold' }}>
                      {coinObj.price[this.state.currency.toLowerCase()]}
                    </Span>
                    <Span
                      style={
                        ({ fontSize: 14 },
                        percentChange1h.positive
                          ? { color: '#12d8b8' }
                          : { color: '#ff6161' })
                      }
                    >
                      {percentChange1h.value}%
                    </Span>
                  </Div>
                </Section>

                <div
                  style={{
                    background: '#f6f8fa',
                    padding: '0 .5rem',
                    border: '1px solid #e5e6e6',
                    width: '100%',
                    overflow: 'auto',
                  }}
                >
                  <FlexGrid>
                    <FlexGridItem component={'fundamentals'}>
                      <Card title="Fundamentals" style={cardStyle}>
                        <List
                          itemLayout="horizontal"
                          dataSource={FundamentalsData(
                            coinObj,
                            this.state.currency,
                          )}
                          renderItem={(item) => {
                            if (item.title === '24HR') {
                              return (
                                <Fragment>
                                  <span
                                    style={{
                                      marginRight: '.4rem',
                                      top: -6,
                                      position: 'relative',
                                    }}
                                    className="ant-list-item-meta-title"
                                  >
                                    {item.title}
                                  </span>
                                  <span
                                    style={{
                                      marginRight: '1.5rem',
                                      top: -6,
                                      position: 'relative',
                                    }}
                                  >
                                    {item.value}
                                  </span>
                                </Fragment>
                              )
                            }
                            if (item.title === '7D') {
                              return (
                                <Fragment>
                                  <span
                                    style={{
                                      marginRight: '.4rem',
                                      top: -6,
                                      position: 'relative',
                                    }}
                                    className="ant-list-item-meta-title"
                                  >
                                    {item.title}
                                  </span>
                                  <span
                                    style={{
                                      marginRight: '1.5rem',
                                      top: -6,
                                      position: 'relative',
                                    }}
                                  >
                                    {item.value}
                                  </span>
                                </Fragment>
                              )
                            }
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

                    <FlexGridItem colWidth={2} component={'chart'}>
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
                      <Card title="Links" style={cardStyle}>
                        <List
                          itemLayout="horizontal"
                          dataSource={LinksData(coinObj)}
                          renderItem={(item) => {
                            if (item.value) {
                              return (
                                <List.Item>
                                  <Icon type={item.icon} />
                                  <a
                                    href={item.value}
                                    target="_blank"
                                    style={{
                                      color: '#000',
                                      marginLeft: '.5rem',
                                      marginTop: '-.25rem',
                                    }}
                                  >
                                    {item.linkType}
                                  </a>
                                </List.Item>
                              )
                            }
                            return <Fragment />
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
    padding-left: 1rem;
  }
`

const Div = (props) => {
  const InDiv = styled.div`
    margin-bottom: ${props.marginBottom ? '1rem' : '2rem'};
    @media (min-width: 900px) {
      display: inline-block;
      margin-right: 1rem;
    }
  `
  return <InDiv>{props.children}</InDiv>
}

const Span = styled.span`
  margin: 0 0.5rem;
`

const HideLarge = styled.div`
  display: block;
  @media (min-width: 1100px) {
    display: none;
  }
`
const FlexGridItemWrap = styled.div`
  width: 100%;
  @media (min-width: 900px) {
    width: auto;
    width: 32%;
  }
`

const cardStyle = {
  flexGrow: 1,
  margin: '1rem .5rem 0 .5rem',
}
