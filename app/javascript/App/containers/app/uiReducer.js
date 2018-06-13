import { fromJS } from 'immutable'

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
      if (value === current) value = false
      return state.setIn(keyPath, value)
    default:
      break
  }
  /*
   * If you want to update the UI state based on other action types, you can add
   * other reducers here as follows:
   *
   *  const stateChange = otherReducer(state, action)
   *  if (stateChange) return stateChange
   *
   * Note: that reducer should not return an updated stated unless it was changed.
   */
  return state
}
