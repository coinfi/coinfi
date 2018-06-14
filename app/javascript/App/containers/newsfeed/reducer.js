import { mergeReducers } from '../../lib/redux'
import { namespace, filterList } from './constants'

const initialState = {}

const newsfeedReducer = (state, action) => {
  const { type } = action

  switch (type) {
    case 'FETCH_MORE_ENTITY_LIST':
      return state.setIn(['loadingEntities', 'newsFeed'], true)
    case 'SET_MORE_ENTITY_LIST':
      return state.setIn(['loadingEntities', 'newsFeed'], false)
    default:
      return state
  }
}

export default mergeReducers(
  { namespace, filterList },
  initialState,
  newsfeedReducer
)
