import { createHOC } from '../../lib/redux'
import actions from './actions'
import selectors from './selectors'
import { filterData, filterList } from './constants'
import { getQueryObject } from '../../lib/urlHelpers'

export default createHOC({
  actions,
  selectors,
  extraProps: { filterData, filterList },
  onMount(container) {
    applyFilters(container)
  }
})

function applyFilters(container) {
  const queryObject = getQueryObject().q
  if (queryObject && Object.keys(queryObject).length > 0) {
    container.props.resetFilters(queryObject)
  } else if (container.props.activeFilters.size > 0) {
    container.props.updateResults()
  }
}
