import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import {
  fetchCoins,
  fetchArticles,
  searchCoins,
  addCoinSuccess,
  editWatchlist,
  removeCoin,
  reorderCoins
} from './actions'
import * as selectors from './selectors'
import WatchlistPage from '../../pages/WatchlistPage'

class WatchlistContainer extends React.Component {
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
        searchCoins,
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
  searchedCoins: selectors.selectSearchedCoins(),
  searchText: selectors.selectSearchText(),
  UI: selectors.selectUI()
})

export default connect(mapState, mapDispatch)(WatchlistContainer)
