import { createEntityReducer } from '../../lib/redux'
import { namespace } from './constants'

export default createEntityReducer(namespace, newsfeedReducer)

function newsfeedReducer(state, action) {
  switch (action.type) {
    default:
      return state
  }
}
