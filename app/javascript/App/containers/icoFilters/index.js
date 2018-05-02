import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { setFilters, setFilter, removeFilter } from './actions'
import * as selectors from './selectors'
import bindFilters from './bindFilters'
import { filterData, filterList } from './constants'

export default Component => {
  class HOC extends React.Component {
    componentWillMount() {
      bindFilters(this.props)
    }
    render() {
      return <Component {...{ ...this.props, filterData, filterList }} />
    }
  }
  function mapDispatch(dispatch) {
    return {
      ...bindActionCreators({ setFilters, setFilter, removeFilter }, dispatch)
    }
  }
  const mapState = createStructuredSelector({
    activeFilters: selectors.selectActiveFilters(),
    availableFilters: selectors.selectAvailableFilters(),
    disabledFilters: selectors.selectDisabledFilters()
  })
  return connect(mapState, mapDispatch)(HOC)
}
