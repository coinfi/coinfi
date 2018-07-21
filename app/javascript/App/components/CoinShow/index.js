import React, { Component, Fragment } from 'react'
import { Layout, Card, Button, Tabs, Menu, Dropdown, Icon } from 'antd'
import styled from 'styled-components'

const TabPane = Tabs.TabPane
const { Header, Footer, Content } = Layout
const menu = (
  <Menu>
    <Menu.Item key="1">USD</Menu.Item>
    <Menu.Item key="2">BTC</Menu.Item>
  </Menu>
)
const FlexGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const FlexGridItem = styled.div`
  height: 80px;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 33.3333%;
  flex-basis: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: 600px) {
    flex-basis: 450px;
  }
  @media (min-width: 900px) {
    flex-basis: 300px;
  }
`

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
            <section>
              <Dropdown overlay={menu}>
                <Button style={{ marginLeft: 8 }}>
                  USD <Icon type="down" />
                </Button>
              </Dropdown>
              <Button>Watch coin</Button>
            </section>
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
                <Card title="Price chart" />
                <Card title="Fundamentals" />
                <Card title="Links" />
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
