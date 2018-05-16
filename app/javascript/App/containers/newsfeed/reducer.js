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
    case 'FETCH_NEWSFEED_COINS_SUCCESS':
      return state.mergeDeep(normalizeCoins(response))
    default:
      return state
  }
}

function articleReducer(state = initialState, action) {
  const { type, response } = action
  switch (type) {
    case 'FETCH_NEWSFEED_ARTICLES_SUCCESS':
      return state.mergeDeep(normalizeArticles(response))
    default:
      return state
  }
}
