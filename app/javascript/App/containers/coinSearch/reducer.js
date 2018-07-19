import {fromJS} from 'immutable'

const initialState = fromJS({})

export default (state = initialState, action) => {
  const {type, response, namespace} = action
  switch (type) {
    case 'SEARCH_COINS':
      const {searchText} = action
      const s = state.setIn([namespace, 'searchText'], searchText)
      if (searchText.length < 2)
        return s.setIn([namespace, 'searchedCoins'], [])
      return s
    case 'SEARCH_COINS_SUCCESS':
      return state.setIn([namespace, 'searchedCoins'], fromJS(response))
    case 'ADD_COIN_SUCCESS':
    case 'CLEAR_SEARCH':
      return state.set(namespace, fromJS({searchText: '', searchedCoins: []}))
    default:
      return state
  }
}
