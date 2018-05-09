import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { searchCoins, clearSearch } from './actions'
import * as selectors from './selectors'

export default Component => (namespace = 'global') => {
  class HOC extends React.Component {
    render() {
      return <Component {...this.props} />
    }
  }
  function mapDispatch(dispatch) {
    return {
      ...bindActionCreators(
        {
          searchCoins: searchCoins(namespace),
          clearSearch: clearSearch(namespace)
        },
        dispatch
      )
    }
  }
  const mapState = createStructuredSelector({
    searchedCoins: selectors.selectSearchedCoins(namespace),
    searchText: selectors.selectSearchText(namespace)
  })
  return connect(mapState, mapDispatch)(HOC)
}
