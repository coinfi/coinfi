import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { searchCoins } from './actions'
import * as selectors from './selectors'

const WatchlistContainer = Component => {
  class HOC extends React.Component {
    render() {
      return <Component {...this.props} />
    }
  }
  function mapDispatch(dispatch) {
    return {
      ...bindActionCreators(
        {
          searchCoins
        },
        dispatch
      )
    }
  }
  const mapState = createStructuredSelector({
    searchedCoins: selectors.selectSearchedCoins(),
    searchText: selectors.selectSearchText()
  })
  return connect(mapState, mapDispatch)(HOC)
}

export default WatchlistContainer
