import { fromJS } from 'immutable'
import { filterList } from './constants'

const initialState = fromJS({
  activeFilters: [],
  UI: {
    newFilter: false
  }
})

export default (state = initialState, action) => {
  const { type, payload, response } = action
  switch (type) {
    case 'TOGGLE_UI':
      const { key, value } = action
      let newState = false
      if (!value) {
        newState = !state.getIn(['UI', key])
      } else {
        newState = value
        if (state.getIn(['UI', key]) === value) newState = false
      }
      return state.setIn(['UI', key], newState)
    case 'SET_FILTERS':
      return state.set('activeFilters', fromJS(payload))
    case 'SET_FILTER':
      const activeFilters = state.get('activeFilters')
      const index = listIndex(activeFilters, payload.key)
      const filter = { ...filterList.find(o => o.key === payload.key) }
      filter.value = payload.value
      delete filter.Component
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
