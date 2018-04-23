import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { searchCoins, clearSearch } from './actions'
import * as selectors from './selectors'

export default Component => {
  class HOC extends React.Component {
    render() {
      return <Component {...this.props} />
    }
  }
  function mapDispatch(dispatch) {
    return {
      ...bindActionCreators(
        {
          searchCoins,
          clearSearch
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
