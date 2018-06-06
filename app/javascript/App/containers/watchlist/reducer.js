import { mergeReducers } from '../../lib/redux'
import { namespace } from './constants'

const initialState = {}

const watchlistReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'REORDER_COINS':
      return state.setIn(['entityIDs', 'coins'], payload)
    default:
      return state
  }
}

export default mergeReducers({ namespace }, initialState, watchlistReducer)
