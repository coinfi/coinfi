import { fromJS } from 'immutable'
import { createEntityReducer } from '../../lib/redux'
import { namespace } from './constants'

export default createEntityReducer(namespace, watchlistReducer)

function watchlistReducer(state, action) {
  switch (action.type) {
    case 'REORDER_COINS':
      return state.setIn(['ids', 'coins'], fromJS(action.order))
    default:
      return state
  }
}
