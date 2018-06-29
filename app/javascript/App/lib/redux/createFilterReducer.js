import { fromJS } from 'immutable'
import { listIndex } from '../stateHelpers'
import initialState from './initialState'

const createFilterReducer = ({ namespace, filterList }) => (
  state = initialState,
  action
) => {
  if (namespace !== action.namespace) return state
  const { type, payload } = action
  const filterIndex = (key) => listIndex(state.get('activeFilters'), key)

  // if (payload && payload.publishedSince !== '') return payload

  const filterObject = (key, value) => {
    console.log(key, value)
    if (value === 'undefined') return
    return filterList.find((o) => o.get('key') === key) && filterList.find((o) => o.get('key') === key).set('value', fromJS(value))
  }
  const isEmpty = (value) => {
    if (value instanceof Array || typeof value === 'string')
      return value.length === 0
    return false
  }
  // console.log(filterObject())
  const removeFilter = (key) =>
    state.deleteIn(['activeFilters', filterIndex(key)])
  const setFilter = (state, { key, value }) => {
    if (isEmpty(value)) return removeFilter(key)
    return state.setIn(
      ['activeFilters', filterIndex(key)],
      filterObject(key, value)
    )
  }
  switch (type) {
    case 'SET_FILTER':
      return setFilter(state, payload)
    case 'REMOVE_FILTER':
      return removeFilter(payload.key)
    case 'SET_FILTERS':
      let filters = fromJS([])
      Object.entries(payload).forEach(([key, value], index) => {
        if (!isEmpty(value))
          filters = filters.set(index, filterObject(key, value))
      })
      return state.set('activeFilters', filters)
    case 'RESET_FILTERS':
      return state.set('activeFilters', fromJS([]))
    default:
      return state
  }
}

export default createFilterReducer
