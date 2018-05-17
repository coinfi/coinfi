import { fromJS } from 'immutable'
import { combineReducers } from 'redux'
import { createReducer } from '../../lib/redux'
import { namespace } from './constants'

export default combineReducers({
  coins: createReducer(namespace, 'coins', (state, action) => {
    const { type, response } = action
    switch (type) {
      case 'REMOVE_COIN_SUCCESS':
        return state.set(
          'result',
          state.get('result').filter((id) => id !== response.id)
        )
      case 'REORDER_COINS':
        return state.set('result', fromJS(action.order))
      default:
        return state
    }
  }),
  articles: createReducer(namespace, 'articles', (state, action) => {
    return state
  })
})

export const uiReducer = (state, action) => {
  const { type } = action
  switch (type) {
    case 'EDIT_WATCHLIST':
      return state.set('editing', !state.get('editing'))
    default:
      break
  }
}
