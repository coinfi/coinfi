import { fromJS } from 'immutable'
import normalize from './normalize'

const initialState = fromJS({
  searchText: '',
  searchedCoins: [],
  entities: {},
  UI: {
    loading: true,
    editing: false
  }
})

export default (state = initialState, action) => {
  const { type, response } = action
  switch (type) {
    case 'FETCH_COINS_SUCCESS':
      return state
        .mergeDeep(normalize.coins(response))
        .setIn(['UI', 'loading'], false)
    case 'FETCH_ARTICLES_SUCCESS':
      return state.mergeDeep(normalize.articles(response))
    case 'SEARCH_COINS':
      const { searchText } = action
      const s = state.set('searchText', searchText)
      if (searchText.length < 2) return s.set('searchedCoins', [])
      return s
    case 'SEARCH_COINS_SUCCESS':
      return state.set('searchedCoins', fromJS(response))
    case 'ADD_COIN_SUCCESS':
      return state
        .set('searchText', '')
        .set('searchedCoins', [])
        .setIn(['UI', 'loading'], true)
    case 'REMOVE_COIN_SUCCESS':
      return state.deleteIn(['entities', 'coins', `${response.id}`])
    case 'EDIT_WATCHLIST':
      return state.setIn(['UI', 'editing'], !state.getIn(['UI', 'editing']))
    default:
      return state
  }
}
