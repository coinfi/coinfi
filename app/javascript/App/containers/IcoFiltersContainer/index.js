import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { toggleUI, setActiveFilters, addFilter } from './actions'
import * as selectors from './selectors'
import { parseFiltersInURL } from './helpers'
import { filterList } from './constants'

export default Component => {
  class HOC extends React.Component {
    componentDidMount() {
      // parse URL to determine which filters have been set
      const currentFilters = parseFiltersInURL()
      // update the state as such
      this.props.setActiveFilters(currentFilters)
    }
    render() {
      const { UI, activeFilters } = this.props
      return (
        <Component
          {...this.props}
          filterList={filterList}
          availableFilters={filterList.filter(
            item => !activeFilters.includes(item.key)
          )}
          UI={key => this.props.UI.get(key)}
        />
      )
    }
  }
  function mapDispatch(dispatch) {
    return {
      ...bindActionCreators({ toggleUI, setActiveFilters, addFilter }, dispatch)
    }
  }
  const mapState = createStructuredSelector({
    UI: selectors.selectUI(),
    activeFilters: selectors.selectActiveFilters()
  })
  return connect(mapState, mapDispatch)(HOC)
}
