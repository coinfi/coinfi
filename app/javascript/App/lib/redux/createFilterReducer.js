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
  const isEmpty = (value) => {
    if (value instanceof Array || typeof value === 'string')
      return value.length === 0
    return false
  }
  const setFilter = (s, { key, value }) => {
    if (isEmpty(value)) return s.deleteIn(['activeFilters', filterIndex(key)])
    filter = filterList
      .find((o) => o.get('key') === key)
      .set('value', fromJS(value))
    return s.setIn(['activeFilters', filterIndex(key)], filter)
  }
  let filter
  switch (type) {
    case 'RESET_FILTERS':
      return state.set('activeFilters', fromJS([]))
    case 'SET_FILTER':
      return setFilter(state, payload)
    case 'REMOVE_FILTER':
      return state.deleteIn(['activeFilters', filterIndex(payload.key)])
    case 'SET_FILTERS':
      const filters = []
      Object.entries(payload).forEach(([key, value]) => {
        if (!isEmpty(value))
          filters.push({
            key,
            value
          })
      })
      return state.set('activeFilters', fromJS(filters))
    default:
      return state
  }
}

export default createFilterReducer
