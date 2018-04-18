import { fromJS } from 'immutable'

const initialState = fromJS({
  searchText: '',
  searchedCoins: []
})

export default (state = initialState, action) => {
  const { type, response } = action
  switch (type) {
    case 'SEARCH_COINS':
      const { searchText } = action
      const s = state.set('searchText', searchText)
      if (searchText.length < 2) return s.set('searchedCoins', [])
      return s
    case 'SEARCH_COINS_SUCCESS':
      return state.set('searchedCoins', fromJS(response))
    case 'ADD_COIN_SUCCESS':
    case 'CLEAR_SEARCH':
      return state.set('searchText', '').set('searchedCoins', [])
    default:
      return state
  }
}
