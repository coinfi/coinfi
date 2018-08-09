import React, { Component, Fragment } from 'react'
import { Button, Menu, Dropdown, Icon, Table, Pagination } from 'antd'
import ColumnNames from './ColumnNames'
import API from '../../lib/localAPI'

class CoinIndex extends Component {
  state = {
    coins: [],
    pagination: {
      defaultPageSize: 10,
      total: this.props.coinCount,
    },
    loading: false,
    currency: 'USD',
  }

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager,
    })
    this.fetchCoins({
      per: pagination.pageSize,
      page: pagination.current,
    })
  }

  fetchCoins = (params = {}) => {
    this.setState({ loading: true })
    API.get('/coinsnew', params).then((response) => {
      this.setState({
        loading: false,
        coins: response,
      })
    })
  }

  componentDidMount() {
    this.fetchCoins()
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
          dataSource={this.state.coins}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          scroll={{ x: 1080 }}
          style={{ background: '#fff' }}
        />
      </Fragment>
    )
  }
}

export default CoinIndex
