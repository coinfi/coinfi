import React, { Component, Fragment } from 'react'
import { Table } from 'antd'
import ColumnNames from './ColumnNames'
import CurrencySelector from '../CurrencySelector'
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
        <div>
          <h1 className="pt3 pl3 fl">Coins</h1>
          <div className="flex fr pt3 pr3">
            <div className="ma2">
              <SearchCoins {...this.props} />
            </div>
            <CurrencySelector
              currency={this.state.currency}
              changeCurrencyHandler={this.changeCurrencyHandler}
            />
          </div>
        </div>

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
