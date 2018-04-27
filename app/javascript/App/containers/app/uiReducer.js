import { fromJS } from 'immutable'
import { uiReducer as watchlistReducer } from '../watchlistPage/reducer'

const initialState = fromJS({})

export default (state = initialState, action) => {
  const { type, key, value } = action
  switch (type) {
    case 'TOGGLE_UI':
      let newState = false
      if (!value) {
        newState = !state.get(key)
      } else {
        newState = value
        if (state.get(key) === value) newState = false
      }
      return state.set(key, newState)
    default:
      break
  }
  const stateChange = watchlistReducer(state, action)
  if (stateChange) return stateChange
  return state
}
