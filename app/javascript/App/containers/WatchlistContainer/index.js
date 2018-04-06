import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import {
  fetchCoins,
  fetchArticles,
  selectCategory,
  searchCoins,
  addCoinSuccess,
  editWatchlist,
  removeCoin,
  reorderCoins
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
        {
          fetchCoins,
          fetchArticles,
          selectCategory,
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
    category: selectors.selectCategory(),
    searchedCoins: selectors.selectSearchedCoins(),
    searchText: selectors.selectSearchText(),
    UI: selectors.selectUI()
  })
  return connect(mapState, mapDispatch)(HOC)
}

export default WatchlistContainer
