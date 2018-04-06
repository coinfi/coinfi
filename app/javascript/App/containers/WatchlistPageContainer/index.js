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
import WatchlistPage from '../../pages/WatchlistPage'

class WatchlistPageContainer extends React.Component {
  componentDidMount() {
    this.props.fetchCoins()
    this.props.fetchArticles()
  }
  render() {
    return <WatchlistPage {...this.props} />
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
  coinIDs: selectors.selectCoinIDs(),
  entities: selectors.selectEntities(),
  UI: selectors.selectUI()
})

export default connect(mapState, mapDispatch)(WatchlistPageContainer)
