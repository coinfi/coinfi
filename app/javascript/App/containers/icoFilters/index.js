import reduxHOC from '../../utils/reduxHOC'
import * as actions from './actions'
import * as selectors from './selectors'
import bindFilters from './bindFilters'
import { filterData, filterList } from './constants'

export default reduxHOC({
  actions,
  selectors,
  extraProps: { filterData, filterList },
  onMount(container) {
    bindFilters(container.props)
  }
})
