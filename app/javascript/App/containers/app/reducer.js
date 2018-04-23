import { fromJS } from 'immutable'
import { uiReducer as watchlistReducer } from '../watchlistPage/reducer'

const initialState = fromJS({
  UI: {}
})

const appReducer = (state = initialState, action) => {
  const { type, key, value } = action
  switch (type) {
    case 'TOGGLE_UI':
      let newState = false
      if (!value) {
        newState = !state.getIn(['UI', key])
      } else {
        newState = value
        if (state.getIn(['UI', key]) === value) newState = false
      }
      return state.setIn(['UI', key], newState)
    default:
      break
  }
  const stateChange = watchlistReducer(state, action)
  if (stateChange) return stateChange
  return state
}

export default appReducer
