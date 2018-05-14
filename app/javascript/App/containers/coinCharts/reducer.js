import { fromJS } from 'immutable'

const initialState = fromJS({
  symbol: null,
  data: {}
})

export default (state = initialState, action) => {
  const { type, data } = action
  switch (type) {
    case 'FETCH_DATA':
      return state.set('symbol', action.symbol)
    case 'FETCH_DATA_SUCCESS':
      return state
        .setIn(['data', 'prices'], data.prices)
        .setIn(['data', 'articles'], data.articles)
    default:
      return state
  }
}
