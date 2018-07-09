import { fromJS } from 'immutable'

const initialState = false

export default (state = initialState, action) => {
  const { type, response } = action
  switch (type) {
    case 'SET_USER':
          debugger
      if (response) return fromJS(response)
      return state
    default:
      return state
  }
}
