import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'
import storage from 'redux-persist/lib/storage'

import uiReducer from './uiReducer'
import userReducer from './userReducer'
import calendarReducer from '../calendar/reducer'

const persistConfig = {
  transforms: [immutableTransform()],
  key: 'root',
  storage,
  whitelist: [],
}

const appReducers = combineReducers({
  user: userReducer,
  UI: uiReducer,
  calendar: calendarReducer,
})

export default persistReducer(persistConfig, appReducers)
