import { createHOC } from '../../lib/redux'
import actions from './actions'
import selectors from './selectors'
import { filterList, events, defaultEvent } from './constants'

export default createHOC({
  actions,
  selectors,
  extraProps: { filterList, events, defaultEvent },
  onMount: ({ props }) => {
    props.initializeFilters()
    props.initializeCalendarState()
  },
})
