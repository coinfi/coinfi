import React, { Component, Fragment } from 'react'
import { Button, Menu, Dropdown, Icon, Table, Pagination } from 'antd'
import ColumnNames from './ColumnNames'

class CoinIndex extends Component {
  state = {
    currency: 'USD',
    priceData: [],
  }

  getPageTotal() {
    return this.props.coinCount
  }

  jumpPage(data) {
    window.location = `/coinsnew?page=${data}`
  }

  changeCurrencyHandler = ({ key }) => {
    this.setState({
      currency: key,
    })
  }

  render() {
    const currencyMenu = (
      <Menu onClick={this.changeCurrencyHandler}>
        <Menu.Item key="USD">USD</Menu.Item>
        <Menu.Item key="BTC">BTC</Menu.Item>
      </Menu>
    )

    const currentPage = Number(this.props.currentPage)

    return (
      <Fragment>
        <h1 className="pt3 pl3">
          Coins
          <Dropdown className="fr" overlay={currencyMenu}>
            <Button className="mr3">
              {this.state.currency === 'USD' && 'USD'}
              {this.state.currency === 'BTC' && 'BTC'}
              <Icon type="down" />
            </Button>
          </Dropdown>
        </h1>

        <Table
          rowKey={(record) => record.symbol + record.name}
          columns={ColumnNames(this.state.currency)}
          dataSource={this.props.coins}
          pagination={false}
          scroll={{ x: 1080 }}
          style={{ background: '#fff' }}
        />
        <Pagination
          className="tc"
          defaultCurrent={currentPage}
          total={this.getPageTotal()}
          onChange={this.jumpPage}
        />
      </Fragment>
    )
  }
}

export default CoinIndex
