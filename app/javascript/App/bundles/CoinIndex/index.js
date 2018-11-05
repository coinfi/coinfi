import React, { Component, Fragment } from 'react'
import { Table } from 'antd'
import compose from 'recompose/compose'
import ColumnNames from './ColumnNames'
import { withWidth } from '@material-ui/core'
import SearchCoins from '~/bundles/common/components/SearchCoins'
import API from '../../bundles/common/utils/localAPI'
import * as _ from 'lodash'
import { withStyles, createStyles } from '@material-ui/core/styles'

const styles = (theme) => createStyles({})

class CoinIndex extends Component {
  constructor(props) {
    super(props)

    const loading =
      _.isUndefined(props.initialCoins) || _.isUndefined(props.marketDominance)

    this.state = {
      coins: props.initialCoins || [],
      pagination: {
        defaultPageSize: 100,
        total: this.props.coinCount,
      },
      loading,
      currency: 'USD',
    }
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
    API.get('/coins', params).then((response) => {
      this.setState({
        loading: false,
        coins: response.payload,
      })
    })
  }

  componentDidMount() {
    if (_.isEmpty(this.state.coins)) {
      this.fetchCoins({ per: this.state.pagination.defaultPageSize })
    }
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
              <SearchCoins
                onSelect={(suggestion) =>
                  (window.location.href = `/coins/${suggestion.slug}`)
                }
                unstyled
              />
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

export default compose(
  withStyles(styles),
  withWidth(),
)(CoinIndex)
