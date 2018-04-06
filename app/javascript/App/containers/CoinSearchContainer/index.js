import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { searchCoins } from './actions'
import * as selectors from './selectors'
import CoinSearch from '../../components/CoinSearch'

class WatchlistContainer extends React.Component {
  render() {
    return <CoinSearch {...this.props} />
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

export default connect(mapState, mapDispatch)(WatchlistContainer)
