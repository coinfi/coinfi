import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { fetchData } from './actions'
import * as selectors from './selectors'

export default Component => {
  class HOC extends React.Component {
    componentDidMount() {
      const { fetchData, symbol } = this.props
      fetchData(symbol)
    }
    render() {
      return <Component {...this.props} />
    }
  }
  function mapDispatch(dispatch) {
    return {
      ...bindActionCreators({ fetchData }, dispatch)
    }
  }
  const mapState = createStructuredSelector({
    prices: selectors.selectPrices,
    articles: selectors.selectArticles
  })
  return connect(mapState, mapDispatch)(HOC)
}
