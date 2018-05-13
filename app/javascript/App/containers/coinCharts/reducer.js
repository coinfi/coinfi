import { fromJS } from 'immutable'

const initialState = fromJS({})

export default (state = initialState, action) => {
  const { type, data } = action
  switch (type) {
    case 'FETCH_DATA_SUCCESS':
      return fromJS(data)
    default:
      return state
  }
}
