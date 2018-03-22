import { fromJS } from 'immutable'

const initialState = fromJS({})

export default (state = initialState, action) => {
  const { type, response } = action
  switch (type) {
    case 'FETCH_COIN_SUCCESS':
      return fromJS(response.data.attributes)
    default:
      return state
  }
}
