import React, { Component, Fragment } from 'react'
import { Layout, Card, Button, Tabs, Menu, Dropdown, Icon } from 'antd'
import {} from 'antd'

const TabPane = Tabs.TabPane
const { Header, Footer, Content } = Layout
const menu = (
  <Menu>
    <Menu.Item key="1">USD</Menu.Item>
    <Menu.Item key="2">BTC</Menu.Item>
  </Menu>
)

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
            <div>
              <section>
                <Dropdown overlay={menu}>
                  <Button style={{ marginLeft: 8 }}>
                    USD <Icon type="down" />
                  </Button>
                </Dropdown>
                <Button>Watch coin</Button>
              </section>
              {/* <Dropdown><Button>USD</Button></Dropdown> */}
              <img
                alt="Bitcoin"
                height="32"
                src="https://gitcdn.link/repo/cjdowner/cryptocurrency-icons/master/svg/color/btc.svg"
                width="32"
              />
              <section>
                <span>Bitcoin</span> <span>BTC</span>
              </section>
              <section>
                <span>$7,370.86</span>
                <span>-1.34%</span>
              </section>
            </div>

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
