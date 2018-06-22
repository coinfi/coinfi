import { mergeReducers } from '../../lib/redux'
import { namespace, filterList } from './constants'

const initialState = {
  loadingEntities: {
    newsfeed: false
  }
}

const newsfeedReducer = (state, action) => {
  const { type } = action

  switch (type) {
    case 'FETCH_MORE_ENTITY_LIST':
      return state.setIn(['loadingEntities', 'newsfeed'], true)
    case 'INITIALIZE_NEWSFEED_STATE':
    case 'SET_MORE_ENTITY_LIST':
      return state.setIn(['loadingEntities', 'newsfeed'], false)
    default:
      return state
  }
}

export default mergeReducers(
  { namespace, filterList },
  initialState,
  newsfeedReducer
)
