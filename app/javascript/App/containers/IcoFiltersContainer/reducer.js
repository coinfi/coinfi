import { fromJS } from 'immutable'

const initialState = fromJS({
  activeFilters: [],
  UI: {
    newFilter: false
  }
})

export default (state = initialState, action) => {
  const { type, payload, response } = action
  switch (type) {
    case 'TOGGLE_UI':
      const { key, value } = action
      let newState = false
      if (!value) {
        newState = !state.getIn(['UI', key])
      } else {
        newState = value
        if (state.getIn(['UI', key]) === value) newState = false
      }
      return state.setIn(['UI', key], newState)
    case 'SET_ACTIVE_FILTERS':
      return state.set('activeFilters', fromJS(payload))
    default:
      return state
  }
}
