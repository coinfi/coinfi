import { mergeReducers } from '../../lib/redux'
import { namespace, filterList } from './constants'

const initialState = {
  loadingEntities: {
    calendar: false,
  },
}

const calendarReducer = (state, action) => {
  const { type } = action

  switch (type) {
    case 'FETCH_MORE_ENTITY_LIST':
      return state.setIn(['loadingEntities', 'calendar'], true)
    case 'INITIALIZE_CALENDAR_STATE':
    case 'SET_MORE_ENTITY_LIST':
      return state.setIn(['loadingEntities', 'calendar'], false)
    default:
      return state
  }
}

export default mergeReducers(
  { namespace, filterList },
  initialState,
  calendarReducer,
)
