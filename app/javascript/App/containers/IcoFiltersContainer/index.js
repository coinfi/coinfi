import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { toggleUI, setFilters, setFilter } from './actions'
import * as selectors from './selectors'
import { parseFiltersInURL } from './helpers'
import { filterList, categories } from './constants'

export default Component => {
  class HOC extends React.Component {
    componentDidMount() {
      // parse URL to determine which filters have been set
      const currentFilters = parseFiltersInURL()
      // update the state as such
      this.props.setFilters(currentFilters)
    }
    render() {
      const { UI, activeFilters } = this.props
      return (
        <Component
          {...this.props}
          filterList={filterList}
          categories={categories}
          availableFilters={filterList.filter(
            item => !activeFilters.find(o => o.get('key') === item.key)
          )}
          showing={(key, val = null) => {
            if (!val) return UI.get(key)
            return UI.get(key) === val
          }}
        />
      )
    }
  }
  function mapDispatch(dispatch) {
    return {
      ...bindActionCreators({ toggleUI, setFilters, setFilter }, dispatch)
    }
  }
  const mapState = createStructuredSelector({
    UI: selectors.selectUI(),
    activeFilters: selectors.selectActiveFilters()
  })
  return connect(mapState, mapDispatch)(HOC)
}
