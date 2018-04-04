import { fromJS } from 'immutable'
import normalize from './normalize'

const initialState = fromJS({
  category: 'listed',
  searchText: '',
  searchedCoins: [],
  entities: {}
})

export default (state = initialState, action) => {
  const { type, response } = action
  switch (type) {
    case 'FETCH_COINS_SUCCESS':
      return state.mergeDeep(normalize.coins(response))
    case 'FETCH_ARTICLES_SUCCESS':
      return state.mergeDeep(normalize.articles(response))
    case 'SELECT_CATEGORY':
      return state.set('category', action.category)
    case 'SEARCH_COINS':
      const { searchText } = action
      const s = state.set('searchText', searchText)
      if (searchText.length < 2) return s.set('searchedCoins', [])
      return s
    case 'SEARCH_COINS_SUCCESS':
      return state.set('searchedCoins', fromJS(response))
    case 'ADD_COIN_SUCCESS':
      return state.set('searchText', '').set('searchedCoins', [])
    default:
      return state
  }
}
