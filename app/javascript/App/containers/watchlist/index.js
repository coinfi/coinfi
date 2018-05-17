import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import {
  fetchWatchlist,
  addCoinSuccess,
  editWatchlist,
  removeCoin,
  reorderCoins
} from './actions'
import * as selectors from './selectors'

export default Component => {
  class HOC extends React.Component {
    componentDidMount() {
      this.props.fetchWatchlist()
    }
    render() {
      return <Component {...this.props} />
    }
  }

  function mapDispatch(dispatch) {
    return {
      ...bindActionCreators(
        {
          fetchWatchlist,
          addCoinSuccess,
          editWatchlist,
          removeCoin,
          reorderCoins
        },
        dispatch
      )
    }
  }

  const mapState = createStructuredSelector({
    coins: selectors.selectCoins(),
    coinIDs: selectors.selectCoinIDs(),
    articles: selectors.selectArticles(),
    tags: selectors.selectTags()
  })

  return connect(mapState, mapDispatch)(HOC)
}
