import { fromJS } from 'immutable'

const initialState = fromJS({})

export default (state = initialState, action) => {
  const { type, response } = action
  switch (type) {
    default:
      return state
  }
}
