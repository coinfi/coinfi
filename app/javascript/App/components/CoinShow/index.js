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
  Avatar,
} from 'antd'
import styled from 'styled-components'
import axios from 'axios'
import SearchCoins from './../shared/SearchCoins'
import CoinCharts from './../CoinCharts'
import SectionHeader from './../shared/SectionHeader'
import CoinListDrawer from './../shared/CoinListDrawer'
import CoinList from './../shared/CoinList'
import newsfeedContainer from './../../containers/newsfeed'
import FundamentalsData from './FundamentalsData'
import LinksData from './LinksData'

const { Footer, Content } = Layout

class CoinShow extends Component {
  state = {
    liveCoinArr: [],
    currency: 'USD',
    watched: this.props.watching,
    iconLoading: false,
  }

  watchlistHandler(coin) {
    if (window.location === `/coins/${coin.get('name')}`) {
      window.location = `/coins/${coin
        .get('name')
        .replace(/ /, '-')
        .toLowerCase()}`
    }
  }

  watchCoinHandler = () => {
    this.setState({
      watched: !this.state.watched,
      iconLoading: true,
    })

    let params
    !this.state.watched
      ? (params = { watchCoin: this.props.coinObj.id })
      : (params = { unwatchCoin: this.props.coinObj.id })
    axios
      .patch('/api/user', params)
      .then((data) => {
        this.setState({
          iconLoading: false,
        })
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
        <Layout style={{ overflow: 'auto' }}>
          <Content>
            <Row>
              {/* watchlist */}
              <Col xs={0} sm={0} m={4} l={4} xl={4}>
                <div
                  style={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderTop: 0,
                    background: '#fff',
                  }}
                >
                  <CoinList
                    {...this.props}
                    watchlistHandler={this.watchlistHandler}
                  />
                </div>
              </Col>

              {/* Coin List Button */}
              <Col xs={24} sm={24} m={20} l={20} xl={20}>
                <SectionHeader>
                  {' '}
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
                {/* main content */}{' '}
                <Row>
                  {/* currency button and watchlist */}
                  <Col xs={24} s={24} m={6}>
                    <ButtonWrap>
                      <Dropdown overlay={currencyMenu}>
                        <Button
                          size="small"
                          style={{ marginLeft: 8, margin: 10 }}
                        >
                          {this.state.currency} <Icon type="down" />
                        </Button>
                      </Dropdown>
                      <Button
                        icon="star"
                        size="small"
                        type="primary"
                        onClick={this.watchCoinHandler}
                        ghost={!this.state.watched}
                        loading={this.state.iconLoading}
                      >
                        {this.state.watched ? 'Unwatch coin' : 'Watch coin'}
                      </Button>
                    </ButtonWrap>
                  </Col>

                  {/* logo and title */}
                  <Col s={24} m={24} xl={24}>
                    <Section>
                      {' '}
                      <Div style={{ marginBottom: '1.5rem' }}>
                        <img alt={coinObj.name} src={coinObj.image_url} />
                      </Div>
                      <DivTitle>
                        <SpanTitle>{coinObj.name}</SpanTitle>
                        <Span style={{ fontSize: 16 }}>{symbol}</Span>
                      </DivTitle>
                      <Div style={{ marginBottom: 0 }}>
                        <Span
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginRight: '.75rem',
                          }}
                        >
                          {this.state.currency === 'USD' ? '$' : ''}
                          {
                            coinObj.price[this.state.currency.toLowerCase()]
                          }{' '}
                          {this.state.currency}
                        </Span>
                        <Span
                          style={
                            ({ fontSize: 14 },
                            percentChange1h.positive
                              ? { color: '#12d8b8' }
                              : { color: '#ff6161' })
                          }
                        >
                          {percentChange1h.value > 0 ? (
                            <Icon
                              type="caret-up"
                              style={{ marginRight: '.25rem' }}
                            />
                          ) : (
                            <Icon
                              type="caret-down"
                              style={{ marginRight: '.25rem' }}
                            />
                          )}
                          <span>{percentChange1h.value}%</span>
                        </Span>
                      </Div>
                    </Section>
                  </Col>
                </Row>
                <Row>
                  {/* chart */}
                  <Col xs={24} sm={16} m={16} l={16} xl={16}>
                    <CardWrap>
                      <Card title="Price chart" style={{ padding: 1 }}>
                        <CoinCharts
                          symbol={symbol}
                          priceData={priceData}
                          annotations={annotations}
                          isTradingViewVisible={isTradingViewVisible}
                        />
                      </Card>
                    </CardWrap>
                  </Col>

                  {/* fundamentals */}
                  <Col xs={24} sm={8} m={8} l={8} xl={8}>
                    <CardWrapLast>
                      <Card title="Fundamentals">
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
                                      ...{ marginRight: '.4rem' },
                                      ...{
                                        top: -6,
                                        position: 'relative',
                                      },
                                    }}
                                    className="ant-list-item-meta-title"
                                  >
                                    {item.title}
                                  </span>
                                  <span
                                    style={{
                                      ...{ marginRight: '1.5rem' },
                                      ...{
                                        top: -6,
                                        position: 'relative',
                                      },
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
                    </CardWrapLast>
                  </Col>

                  {/* links */}
                  <Col xs={24} sm={8} m={8} l={8} xl={8}>
                    <CardWrapLast>
                      <Card title="Links">
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
                    </CardWrapLast>
                  </Col>

                  {/* summary */}
                  <Col xs={24} sm={24} l={16} xl={16}>
                    <Card title="Summary" style={{ display: 'none' }}>
                      <p>
                        {' '}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Integer nec odio. Praesent libero. Sed cursus ante
                        dapibus diam. Sed nisi. Nulla quis sem at nibh elementum
                        imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce
                        nec tellus sed augue semper porta. Mauris massa.
                        Vestibulum lacinia arcu eget nulla. Class aptent taciti
                        sociosqu ad litora torquent per conubia nostra, per
                        inceptos himenaeos. Curabitur sodales ligula in libero.{' '}
                      </p>
                    </Card>
                  </Col>

                  {/* ratings */}
                  <Col xs={24} sm={24} l={8} xl={8}>
                    <Card title="Ratings" style={{ display: 'none' }}>
                      <RatingsDiv style={{ marginLeft: 0 }}>
                        <strong>4.0</strong>
                        <span>
                          ICO bench <br />expert rating
                        </span>
                      </RatingsDiv>
                      <RatingsDiv style={{ marginRight: 0 }}>
                        <strong>Very High</strong>
                        <span>
                          ICO drops<br /> score (interest)
                        </span>
                      </RatingsDiv>
                    </Card>
                  </Col>

                  {/* team */}
                  <Col xs={24} sm={24} xl={16}>
                    <Card title="Team" style={{ display: 'none' }}>
                      <TeamDiv style={{ marginLeft: 0 }}>
                        <Avatar
                          size={64}
                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                          style={{ marginBottom: 20 }}
                        />
                        <strong>Name</strong>
                        <p>title</p>
                      </TeamDiv>
                      <TeamDiv style={{ marginRight: 0 }}>
                        <Avatar
                          size={64}
                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                          style={{ marginBottom: 20 }}
                        />
                        <strong>Name</strong>
                        <p>title</p>
                      </TeamDiv>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Content>
          <Footer>
            <CoinListDrawer {...this.props} coins={coinsCollection} />
          </Footer>
        </Layout>
      </Fragment>
    )
  }
}

export default newsfeedContainer(CoinShow)

const ButtonWrap = styled.div`
  text-align: right;
  margin: 0 1rem;
  margin-right: 1.2rem;
  @media (min-width: 900px) {
    float: right;
    position: absolute;
    top: 60px;
    right: 0;
  }
`

const Section = styled.section`
  text-align: center;
  margin: 3rem 0;
  background: #fff;
  margin-top: 0;
  height: 100%;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  margin-bottom: 0;
  @media (min-width: 900px) {
    text-align: left;
    margin: 0;
    padding-top: 1rem;
    padding-left: 1rem;
  }
`

const Div = styled.div`
  margin-bottom: 4.5rem;
  height: 56px;
  > img {
    height: 100%;
    width: auto;
    margin-top: 40px;
  }
  @media (min-width: 900px) {
    display: inline-block;
    margin-right: 0.75rem;
    height: 32px;
    > img {
      margin-top: -9px;
    }
  }
`

const DivTitle = styled.div`
  height: 56px;
  margin-top: 120px;
  margin-bottom: 0;
  @media (min-width: 900px) {
    display: inline-block;
    margin-right: 0.75rem;
    height: 32px;
    margin-top: 0;
  }
`

const Span = styled.span`
  margin: 0 0.5rem 0 0;
`

const SpanTitle = styled.span`
  margin: 0 0.5rem 0 0;
  font-size: 24px;
  font-weight: bold;
`

const HideLarge = styled.div`
  display: block;
  @media (min-width: 1100px) {
    display: none;
  }
`

const RatingsDiv = styled.div`
  display: inline-block;
  width: 47%;
  background: #f6f8fa;
  margin: 0.5rem;
  padding: 0.5rem;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  font-size: 12px;
  > strong {
    display: block;
    margin-bottom: 0.4rem;
  }
`

const TeamDiv = styled.div`
  display: inline-block;
  width: 47%;
  margin: 0.5rem;
  padding: 0.5rem;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  font-size: 12px;
  border: 1px solid #e5e6e6;
  > strong {
    display: block;
    font-size: 14px;
  }
`

const CardWrap = styled.div`
  padding: 16px;
  padding-bottom: 0;
  @media (min-width: 600px) {
    padding: 16px;
    padding-right: 0;
  }
`

const CardWrapLast = styled.div`
  padding: 16px;
  padding-bottom: 0;
  @media (min-width: 600px) {
    padding: 16px;
    padding-bottom: 0;
  }
`
