import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'
import storage from 'redux-persist/lib/storage'

import uiReducer from './uiReducer'
import watchlistReducer from '../watchlist/reducer'
import coinSearchReducer from '../coinSearch/reducer'
import icoFiltersReducer from '../icoFilters/reducer'

const persistConfig = {
  transforms: [immutableTransform()],
  key: 'root',
  storage,
  whitelist: ['icoFilters']
}

const appReducers = combineReducers({
  UI: uiReducer,
  watchlist: watchlistReducer,
  coinSearch: coinSearchReducer,
  icoFilters: icoFiltersReducer
})

export default persistReducer(persistConfig, appReducers)
