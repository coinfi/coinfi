import React, { Component, Fragment } from 'react'
import { Table } from 'antd'
import ColumnNames from './ColumnNames'
import SearchCoins from '../shared/SearchCoins'
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
    return (
      <Fragment>
        <div className="flex">
          <h1 className="pt3 pl3">Coins</h1>
          <span style={{ flexGrow: 1 }} />
          <div className="flex pt3">
            <div className="ma2">
              <SearchCoins {...this.props} />
            </div>
          </div>
        </div>

        <Table
          rowKey={(record) => record.symbol + record.name}
          columns={ColumnNames(this.state.currency)}
          dataSource={this.state.coins}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          loading={{ spinning: this.state.loading }}
          scroll={{ x: 1080 }}
          style={{ background: '#fff' }}
        />
      </Fragment>
    )
  }
}

export default CoinIndex
