import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { fetchCoin } from './actions'
import * as selectors from './selectors'

const Container = Page => {
  class HOC extends Component {
    id = window.location.pathname.split('/')[2]
    componentDidMount() {
      const { fetchCoin } = this.props
      fetchCoin(this.id)
    }
    render() {
      return <Page {...this.props} />
    }
  }

  function mapDispatch(dispatch) {
    return {
      ...bindActionCreators({ fetchCoin }, dispatch)
    }
  }

  const mapState = createStructuredSelector({
    coin: selectors.coin()
  })
  return connect(mapState, mapDispatch)(HOC)
}

export default Container
