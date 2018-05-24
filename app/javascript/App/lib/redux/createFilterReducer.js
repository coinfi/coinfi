import { fromJS, List } from 'immutable'
import { listIndex } from '../stateHelpers'

const initialState = fromJS({
  activeFilters: []
})

const filterActions = ['RESET_FILTERS', 'SET_FILTER', 'REMOVE_FILTER']

const createFilterReducer = ({ namespace, filterList }, wrappedReducer) => (
  state = initialState,
  action
) => {
  if (!filterActions.includes(action.type)) {
    if (wrappedReducer) return wrappedReducer(state, action)
    return state
  }
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
