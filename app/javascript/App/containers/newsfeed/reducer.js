import { combineReducers } from 'redux'
import { createReducer } from '../../lib/redux'
import { namespace } from './constants'

export default combineReducers({
  coins: createReducer(namespace, 'coins'),
  articles: createReducer(namespace, 'articles')
})
