import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import {
  fetchCoins,
  fetchArticles,
  addCoinSuccess,
  editWatchlist,
  removeCoin,
  reorderCoins
} from './actions'
import * as selectors from './selectors'

export default Component => {
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
        {
          fetchCoins,
          fetchArticles,
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
    entities: selectors.selectEntities()
  })

  return connect(mapState, mapDispatch)(HOC)
}
