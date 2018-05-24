import { createEntityReducer } from '../../lib/redux'
import { namespace } from './constants'

export default createEntityReducer(namespace, watchlistReducer)

function watchlistReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'REORDER_COINS':
      return state.setIn(['entityIDs', 'coins'], payload)
    default:
      return state
  }
}
