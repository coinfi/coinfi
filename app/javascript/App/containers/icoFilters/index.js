import { createHOC } from '../../lib/redux'
import * as actions from './actions'
import * as selectors from './selectors'
import bindFilters from './bindFilters'
import { filterData, filterList } from './constants'

export default createHOC({
  actions,
  selectors,
  extraProps: { filterData, filterList },
  onMount(container) {
    bindFilters(container.props)
  }
})
