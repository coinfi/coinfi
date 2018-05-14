import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'
import storage from 'redux-persist/lib/storage'

import uiReducer from './uiReducer'
import watchlistPageReducer from '../watchlistPage/reducer'
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
  watchlist: watchlistPageReducer,
  coinSearch: coinSearchReducer,
  icoFilters: icoFiltersReducer
})

export default persistReducer(persistConfig, appReducers)
