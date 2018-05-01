import { fromJS } from 'immutable'
import { filterList } from './constants'
import { listIndex } from '../../utils/stateHelpers'

const initialState = fromJS({
  activeFilters: []
})

export default (state = initialState, action) => {
  const { type, payload } = action
  const filterIndex = () => listIndex(state.get('activeFilters'), payload.key)
  switch (type) {
    case 'SET_FILTERS':
      return state.set('activeFilters', fromJS(payload))
    case 'SET_FILTER':
      const filter = filterList.find(o => o.get('key') === payload.key).toJS()
      filter.value = payload.value
      return state.setIn(['activeFilters', filterIndex()], fromJS(filter))
    case 'REMOVE_FILTER':
      return state.deleteIn(['activeFilters', filterIndex()])
    default:
      return state
  }
}
