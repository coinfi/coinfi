import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'
import storage from 'redux-persist/lib/storage'

import uiReducer from './uiReducer'
import userReducer from './userReducer'
import icoFiltersReducer from '../icoFilters/reducer'
import calendarReducer from '../calendar/reducer'

const persistConfig = {
  transforms: [immutableTransform()],
  key: 'root',
  storage,
  whitelist: ['icoFilters'],
}

const appReducers = combineReducers({
  user: userReducer,
  UI: uiReducer,
  icoFilters: icoFiltersReducer,
  calendar: calendarReducer,
})

export default persistReducer(persistConfig, appReducers)
