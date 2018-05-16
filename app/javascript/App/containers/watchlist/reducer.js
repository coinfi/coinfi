import { combineReducers } from 'redux'
import { fromJS } from 'immutable'
import normalizeCoins from '../../normalizers/coins'
import normalizeArticles from '../../normalizers/articles'

const initialState = fromJS({})

export default combineReducers({
  coins: coinReducer,
  articles: articleReducer
})

function coinReducer(state = initialState, action) {
  const { type, response } = action
  switch (type) {
    case 'FETCH_COINS_SUCCESS':
      return state.mergeDeep(normalizeCoins(response))
    case 'REMOVE_COIN_SUCCESS':
      return state.set(
        'result',
        state.get('result').filter(id => id !== response.id)
      )
    case 'REORDER_COINS':
      return state.set('result', fromJS(action.order))
    default:
      return state
  }
}

function articleReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_ARTICLES_SUCCESS':
      return state.mergeDeep(normalizeArticles(action.response))
    default:
      return state
  }
}

export const uiReducer = (state, action) => {
  const { type } = action
  switch (type) {
    case 'FETCH_COINS_SUCCESS':
      return state.set('loading', false)
    case 'ADD_COIN_SUCCESS':
      return state.set('loading', true)
    case 'EDIT_WATCHLIST':
      return state.set('editing', !state.get('editing'))
    default:
      break
  }
}
