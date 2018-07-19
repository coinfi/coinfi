import {combineReducers} from 'redux'
import {persistReducer} from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'
import storage from 'redux-persist/lib/storage'

import uiReducer from './uiReducer'
import userReducer from './userReducer'
import watchlistReducer from '../watchlist/reducer'
import coinSearchReducer from '../coinSearch/reducer'
import icoFiltersReducer from '../icoFilters/reducer'
import newsfeedReducer from '../newsfeed/reducer'

const persistConfig = {
  transforms: [immutableTransform()],
  key: 'root',
  storage,
  whitelist: ['icoFilters', 'newsfeed'],
}

const appReducers = combineReducers({
  user: userReducer,
  UI: uiReducer,
  watchlist: watchlistReducer,
  coinSearch: coinSearchReducer,
  icoFilters: icoFiltersReducer,
  newsfeed: newsfeedReducer,
})

export default persistReducer(persistConfig, appReducers)
