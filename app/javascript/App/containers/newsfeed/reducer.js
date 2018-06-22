import { mergeReducers } from '../../lib/redux'
import { namespace, filterList } from './constants'

const initialState = {}

const newsfeedReducer = (state, action) => state

export default mergeReducers(
  { namespace, filterList },
  initialState,
  newsfeedReducer
)
