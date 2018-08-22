import React, { Component, Fragment } from 'react'
import { Layout, Card, Button, List, Col, Row, Avatar } from 'antd'
import styled from 'styled-components'
import axios from 'axios'
import SearchCoins from './../shared/SearchCoins'
import CoinCharts from './../CoinCharts'
import SectionHeader from './../shared/SectionHeader'
import newsfeedContainer from './../../containers/newsfeed'
import FundamentalsData from './FundamentalsData'
import LinksData from './LinksData'

const { Content } = Layout

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

  componentDidMount() {
    setTimeout(() => {
      window.priceChart.setSize()
    }, 100)
  }

  render() {
    const {
      symbol,
      priceData,
      annotations,
      isTradingViewVisible,
      modeAnalyticsUrl,
      coinObj,
    } = this.props

    const percentChange1h = {
      positive: coinObj.change1h > 0,
      value: coinObj.change1h,
    }

    return (
      <Fragment>
        <Layout style={{ overflow: 'auto' }}>
          <Content>
            <Row>
              {/* Coin List Button */}
              <Col xs={24} sm={24} m={24} l={24} xl={24}>
                <SectionHeader>
                  <SearchCoins {...this.props} coinShow />
                </SectionHeader>
                {/* main content */}{' '}
                <Row>
                  {/* logo and title */}
                  <Col s={24} m={24} xl={24}>
                    <Section>
                      <Div style={{ marginBottom: '1rem' }}>
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
                            percentChange1h.positive
                              ? { color: '#12d8b8' }
                              : { color: '#ff6161' }
                          }
                        >
                          {percentChange1h.value > 0 ? (
                            <i
                              className="material-icons"
                              style={{ position: 'relative', top: 7 }}
                            >
                              arrow_drop_up
                            </i>
                          ) : (
                            <i
                              className="material-icons"
                              style={{ position: 'relative', top: 7 }}
                            >
                              arrow_drop_down
                            </i>
                          )}
                          <span>{percentChange1h.value}%</span>
                        </Span>
                        <Button
                          size="small"
                          type="primary"
                          onClick={this.watchCoinHandler}
                          ghost={!this.state.watched}
                          loading={this.state.iconLoading}
                          style={{ height: 32, marginLeft: '0.75rem' }}
                        >
                          <i
                            className="material-icons"
                            style={{
                              fontSize: 15,
                              position: 'relative',
                              top: 3,
                              left: -3,
                            }}
                          >
                            star
                          </i>
                          <span
                            style={{
                              position: 'relative',
                              top: 0,
                              marginLeft: 4,
                            }}
                          >
                            {this.state.watched ? 'Unwatch Coin' : 'Watch Coin'}
                          </span>
                        </Button>
                      </Div>
                    </Section>
                  </Col>
                </Row>
                <Row>
                  {/* chart */}
                  <Col xs={24} sm={16} m={16} l={16} xl={16}>
                    <CardWrap>
                      <Card title="Price Chart" style={{ padding: 1 }}>
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
                                  {item.icon === 'twitter' && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="13"
                                      height="11"
                                      viewBox="0 0 13 11"
                                      style={{
                                        position: 'relative',
                                        top: 1,
                                        left: 3,
                                        marginRight: 4,
                                      }}
                                    >
                                      <g fill="none" fillRule="evenodd">
                                        <path
                                          fill="#000"
                                          fillOpacity=".54"
                                          d="M12.292 1.531a4.92 4.92 0 0 1-1.25 1.302v.313c0 1.823-.656 3.476-1.966 4.96-1.311 1.485-3.052 2.227-5.222 2.227A6.956 6.956 0 0 1 0 9.187c.278.035.477.053.599.053a4.899 4.899 0 0 0 3.125-1.094 2.535 2.535 0 0 1-1.458-.508 2.386 2.386 0 0 1-.886-1.237c.209.035.365.052.469.052.174 0 .4-.035.677-.104a2.546 2.546 0 0 1-1.445-.872 2.4 2.4 0 0 1-.586-1.602v-.026c.382.208.764.312 1.146.312C.894 3.675.52 2.972.52 2.052c0-.434.113-.85.338-1.25 1.337 1.65 3.065 2.526 5.183 2.63-.035-.121-.052-.312-.052-.573 0-.711.243-1.31.729-1.796.486-.487 1.085-.73 1.797-.73.711 0 1.32.27 1.823.808.52-.087 1.059-.296 1.614-.625-.173.607-.547 1.076-1.12 1.406a4.3 4.3 0 0 0 1.459-.39z"
                                        />
                                        <path d="M-2-3h16v16H-2z" />
                                      </g>
                                    </svg>
                                  )}
                                  {item.icon !== 'twitter' && (
                                    <i
                                      className="material-icons"
                                      style={{
                                        position: 'relative',
                                        top: 0,
                                        fontSize: 15,
                                      }}
                                    >
                                      {item.icon}
                                    </i>
                                  )}

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

                  {modeAnalyticsUrl ? (
                    <Col xs={24} sm={24} m={24} l={24} xl={24}>
                      <CardWrapLast>
                        <Card title="Token Metrics">
                          <a href={modeAnalyticsUrl} className="mode-embed">
                            Token Metrics
                          </a>
                          {/*
                          <iframe
                            title="Token Metrics"
                            src={modeAnalyticsUrl}
                            width="100%"
                            height="2048"
                            frameBorder="0"
                          />
                        */}
                        </Card>
                      </CardWrapLast>
                    </Col>
                  ) : null}

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
        </Layout>
      </Fragment>
    )
  }
}

export default newsfeedContainer(CoinShow)

const Section = styled.section`
  text-align: center;
  background: #fff;
  height: 100%;
  margin-top: 0;
  padding-top: 1.5rem;
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
  height: 32px;
  margin-top: 64px;
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
