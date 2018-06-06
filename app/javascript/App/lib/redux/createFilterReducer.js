import { fromJS, List } from 'immutable'
import { listIndex } from '../stateHelpers'
import initialState from './initialState'

const createFilterReducer = ({ namespace, filterList }) => (
  state = initialState,
  action
) => {
  if (namespace !== action.namespace) return state
  const { type, payload } = action
  const filterIndex = (key) => listIndex(state.get('activeFilters'), key)
  const setFilter = (s, { key, value }) => {
    filter = filterList
      .find((o) => o.get('key') === key)
      .set('value', fromJS(value))
    return s.setIn(['activeFilters', filterIndex(key)], filter)
  }
  let filter
  switch (type) {
    case 'RESET_FILTERS':
      return initialState.set(
        'activeFilters',
        List(
          Object.entries(payload).map(([key, value]) =>
            filterList
              .find((o) => o.get('key') === key)
              .set('value', fromJS(value))
          )
        )
      )
    case 'SET_FILTER':
      return setFilter(state, payload)
    case 'REMOVE_FILTER':
      return state.deleteIn(['activeFilters', filterIndex(payload.key)])
    case 'SET_FILTERS':
      let newState = state
      Object.entries(payload).forEach(([key, value]) => {
        console.log(key)
        newState = setFilter(newState, { key, value })
      })
      return newState
    default:
      return state
  }
}

export default createFilterReducer
