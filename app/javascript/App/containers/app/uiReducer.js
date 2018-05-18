import { fromJS } from 'immutable'
import { uiReducer as watchlistReducer } from '../watchlist/reducer'

const initialState = fromJS({})

export default (state = initialState, action) => {
  const { type, keyPath } = action
  let value
  switch (type) {
    case 'SET_UI':
      if (typeof keyPath === 'string') {
        return state.set(keyPath, true)
      }
      value = keyPath.pop()
      return state.setIn(keyPath, value)
    case 'TOGGLE_UI':
      if (typeof keyPath === 'string') {
        const newState = !state.get(keyPath)
        return state.set(keyPath, newState)
      }
      value = keyPath.pop()
      const current = state.getIn(keyPath)
      if (value === current) {
        return state.setIn(keyPath, false)
      } else {
        return state.setIn(keyPath, value)
      }
    default:
      break
  }
  const stateChange = watchlistReducer(state, action)
  if (stateChange) return stateChange
  return state
}
