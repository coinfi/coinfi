import { fromJS } from 'immutable'
import normalize from './normalize'

const initialState = fromJS({
  category: 'listed',
  filterText: '',
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
    case 'FILTER_COINS':
      return state.set('filterText', action.filterText)
    case 'SEARCH_COINS_SUCCESS':
      return state.set('searchedCoins', fromJS(response))
    default:
      return state
  }
}
