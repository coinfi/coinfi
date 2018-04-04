import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import {
  fetchCoins,
  fetchArticles,
  selectCategory,
  searchCoins
} from './actions'
import * as selectors from './selectors'

const WatchlistContainer = Component => {
  class HOC extends React.Component {
    componentDidMount() {
      this.props.fetchCoins()
      this.props.fetchArticles()
    }
    render() {
      return <Component {...this.props} />
    }
  }
  function mapDispatch(dispatch) {
    return {
      ...bindActionCreators(
        { fetchCoins, fetchArticles, selectCategory, searchCoins },
        dispatch
      )
    }
  }

  const mapState = createStructuredSelector({
    entities: selectors.selectEntities(),
    category: selectors.selectCategory(),
    searchedCoins: selectors.selectSearchedCoins()
  })
  return connect(mapState, mapDispatch)(HOC)
}

export default WatchlistContainer
