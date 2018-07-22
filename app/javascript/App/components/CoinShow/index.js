import React, { Component, Fragment } from 'react'
import { Layout, Card, Button, Tabs, Menu, Dropdown, Icon } from 'antd'
import styled from 'styled-components'
import FlexGrid from './FlexGrid'
import FlexGridItem from './FlexGridItem'
import CoinCharts from './../CoinCharts'

const TabPane = Tabs.TabPane
const { Header, Footer, Content } = Layout
const menu = (
  <Menu>
    <Menu.Item key="1">USD</Menu.Item>
    <Menu.Item key="2">BTC</Menu.Item>
  </Menu>
)

const cardStyle = {
  flexGrow: 1,
}

export default class CoinShow extends Component {
  componentDidMount() {
    document.querySelector('.container-wide').style.visibility = 'hidden'
    document.querySelector('.container-wide').style.marginTop = '200px'
  }
  render() {
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
            <section>
              <FlexGrid>
                <FlexGridItem>
                  <img
                    alt="Bitcoin"
                    height="32"
                    src="https://gitcdn.link/repo/cjdowner/cryptocurrency-icons/master/svg/color/btc.svg"
                    width="32"
                  />
                </FlexGridItem>
                <FlexGridItem>
                  <span>Bitcoin</span> <span>BTC</span>
                </FlexGridItem>
                <FlexGridItem>
                  <span>$7,370.86</span>
                  <span>-1.34%</span>
                </FlexGridItem>
              </FlexGrid>
            </section>

            <Tabs defaultActiveKey="1">
              <TabPane tab="Overview" key="1">
                <FlexGrid>
                  <FlexGridItem colWidth={2}>
                    <Card title="Price chart" style={cardStyle}>
                      <CoinCharts
                        symbol="BTC"
                        priceData={{}}
                        annotations={{}}
                        isTradingViewVisible={true}
                      />
                    </Card>
                  </FlexGridItem>
                  <FlexGridItem>
                    <Card title="Fundamentals" style={cardStyle}>
                      bar
                    </Card>
                  </FlexGridItem>
                  <FlexGridItem>
                    <Card title="Links" style={cardStyle}>
                      baz
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
