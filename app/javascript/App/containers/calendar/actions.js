import { namespace } from './constants'
import { createEntityActions, createFilterActions } from '../../lib/redux'

const entityActions = createEntityActions(namespace)
const filterActions = createFilterActions(namespace)

const fetchMoreCalendarEvents = () => {
  return { type: 'FETCH_MORE_CALENDAR_EVENTS' }
}

const initializeCalendarState = () => {
  return { type: 'INITIALIZE_CALENDAR_STATE' }
}

export default {
  ...entityActions,
  ...filterActions,
  fetchMoreCalendarEvents,
  initializeCalendarState,
}
