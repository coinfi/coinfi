import { fromJS } from 'immutable'

const initialState = fromJS({
  UI: {
    newFilter: false
  }
})

export default (state = initialState, action) => {
  const { type, response } = action
  switch (type) {
    case 'TOGGLE_NEW':
      const b = !state.getIn(['UI', 'newFilter'])
      return state.setIn(['UI', 'newFilter'], b)
    default:
      return state
  }
}
