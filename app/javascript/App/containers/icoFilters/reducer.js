import { fromJS } from 'immutable'
import { filterList } from './constants'

const initialState = fromJS({
  activeFilters: []
})

export default (state = initialState, action) => {
  const { type, payload, response } = action
  switch (type) {
    case 'SET_FILTERS':
      return state.set('activeFilters', fromJS(payload))
    case 'SET_FILTER':
      const activeFilters = state.get('activeFilters')
      const index = listIndex(activeFilters, payload.key)
      const filter = filterList.find(o => o.get('key') === payload.key).toJS()
      filter.value = payload.value
      return state.setIn(['activeFilters', index], fromJS(filter))
    default:
      return state
  }
}

const listIndex = (list, value, key = 'key') => {
  let index = list.size
  const existingIndex = list.findIndex(o => o.get(key) === value)
  if (existingIndex >= 0) index = existingIndex
  return index
}
