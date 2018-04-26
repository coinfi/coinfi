import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { setFilters, setFilter, removeFilter } from './actions'
import * as selectors from './selectors'
import { parseFiltersInURL } from './helpers'
import { filterList, filterData } from './constants'

export default Component => {
  class HOC extends React.Component {
    componentDidMount() {
      // parse URL to determine which filters have been set
      const currentFilters = parseFiltersInURL()
      // update the state as such
      this.props.setFilters(currentFilters)
    }
    render() {
      const { activeFilters } = this.props
      const inactiveFilters = filterList.filter(
        item => !activeFilters.find(o => o.get('key') === item.get('key'))
      )
      return (
        <Component
          {...{ ...this.props, inactiveFilters, filterList, filterData }}
        />
      )
    }
  }
  function mapDispatch(dispatch) {
    return {
      ...bindActionCreators({ setFilters, setFilter, removeFilter }, dispatch)
    }
  }
  const mapState = createStructuredSelector({
    activeFilters: selectors.selectActiveFilters()
  })
  return connect(mapState, mapDispatch)(HOC)
}
