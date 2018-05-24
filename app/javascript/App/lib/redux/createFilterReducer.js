import { fromJS, List } from 'immutable'
import { listIndex } from '../stateHelpers'
import initialState from './initialState'

const createFilterReducer = ({ namespace, filterList }) => (
  state = initialState,
  action
) => {
  if (namespace !== action.namespace) return state
  const { type, payload } = action
  const filterIndex = () => listIndex(state.get('activeFilters'), payload.key)
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
      filter = filterList
        .find((o) => o.get('key') === payload.key)
        .set('value', fromJS(payload.value))
      return state.setIn(['activeFilters', filterIndex()], filter)
    case 'REMOVE_FILTER':
      return state.deleteIn(['activeFilters', filterIndex()])
    default:
      return state
  }
}

export default createFilterReducer
