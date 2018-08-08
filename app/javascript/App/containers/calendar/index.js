import { createHOC } from '../../lib/redux'
import actions from './actions'
import selectors from './selectors'
import { filterList, events, defaultEvent, eventStatuses } from './constants'

export default createHOC({
  actions,
  selectors,
  extraProps: { filterList, events, defaultEvent, eventStatuses },
  onMount: ({ props }) => {
    props.initializeFilters()
    props.initializeCalendarState()
  },
})
