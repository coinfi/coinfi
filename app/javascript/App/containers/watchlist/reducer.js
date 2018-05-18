import { fromJS } from 'immutable'
import { createEntityReducer } from '../../lib/redux'
import { namespace } from './constants'

export default createEntityReducer(namespace, watchlistReducer)

function watchlistReducer(state, action) {
  const { type, response } = action
  switch (type) {
    case 'REMOVE_COIN_SUCCESS':
      return state.setIn(
        ['ids', 'coins'],
        state.getIn(['ids', 'coins']).filter((id) => id !== response.id)
      )
    case 'REORDER_COINS':
      return state.setIn(['ids', 'coins'], fromJS(action.order))
    default:
      return state
  }
}

export const uiReducer = (state, action) => {
  const { type } = action
  switch (type) {
    case 'EDIT_WATCHLIST':
      return state.set('editing', !state.get('editing'))
    default:
      break
  }
}
