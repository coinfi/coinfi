import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { fromJS } from 'immutable'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'

import storage from 'redux-persist/lib/storage'
import sagas from './configureSagas'

import appReducer from './containers/app/reducer'
import watchlistPageReducer from './containers/watchlistPage/reducer'
import coinSearchReducer from './containers/coinSearch/reducer'
import icoFiltersReducer from './containers/icoFilters/reducer'

const sagaMiddleware = createSagaMiddleware()

const persistConfig = {
  transforms: [immutableTransform()],
  key: 'root',
  storage,
  whitelist: ['icoFilters']
}

const rootReducer = combineReducers({
  app: appReducer,
  watchlist: watchlistPageReducer,
  coinSearch: coinSearchReducer,
  icoFilters: icoFiltersReducer
})

export default function configureStore(initialState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const middlewares = [sagaMiddleware]
  const enhancers = [applyMiddleware(...middlewares)]
  const store = createStore(
    persistReducer(persistConfig, rootReducer),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  )
  const persistor = persistStore(store)
  // persistor.purge()
  sagaMiddleware.run(sagas)
  return { store, persistor }
}
