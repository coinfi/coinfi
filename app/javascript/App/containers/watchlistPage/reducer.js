import { fromJS } from 'immutable'
import normalize from './normalize'

const initialState = fromJS({
  searchText: '',
  searchedCoins: [],
  entities: {}
})

export default (state = initialState, action) => {
  const { type, response } = action
  switch (type) {
    case 'FETCH_COINS_SUCCESS':
      const n = normalize.coins(response)
      return state.mergeDeep(n).set('coinIDs', n.result)
    case 'FETCH_ARTICLES_SUCCESS':
      return state.mergeDeep(normalize.articles(response))
    case 'REMOVE_COIN_SUCCESS':
      return state.set(
        'coinIDs',
        state.get('coinIDs').filter(id => id !== response.id)
      )
    case 'REORDER_COINS':
      return state.set('coinIDs', action.order)
    default:
      return state
  }
}

export const uiReducer = (state, action) => {
  const { type } = action
  switch (type) {
    case 'FETCH_COINS_SUCCESS':
      return state.setIn(['UI', 'loading'], false)
    case 'ADD_COIN_SUCCESS':
      return state.setIn(['UI', 'loading'], true)
    case 'EDIT_WATCHLIST':
      return state.setIn(['UI', 'editing'], !state.getIn(['UI', 'editing']))
    default:
      break
  }
}
