import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistStore } from 'redux-persist'

import appSagas from './containers/app/sagas'
import appReducers from './containers/app/reducers'

export default function configureStore() {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = [sagaMiddleware]
  const enhancers = [applyMiddleware(...middlewares)]
  const store = createStore(
    appReducers,
    undefined,
    composeEnhancers(...enhancers)
  )
  const persistor = persistStore(store)
  // persistor.purge()
  sagaMiddleware.run(appSagas)
  return { store, persistor }
}
