import { createHOC } from '../../lib/redux'
import actions from './actions'
import selectors from './selectors'
import { filterData, filterList } from './constants'

export default createHOC({
  actions,
  selectors,
  extraProps: { filterData, filterList },
  onMount({ props }) {
    props.initializeFilters()
  }
})
