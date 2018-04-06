import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { fromJS } from 'immutable'
import createSagaMiddleware from 'redux-saga'
import watchlistReducer from '../../containers/WatchlistContainer/reducer'
import sagas from './configureSagas'

const sagaMiddleware = createSagaMiddleware()

export default function configureStore(initialState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const rootReducer = combineReducers({
    watchlist: watchlistReducer
  })

  const middlewares = [sagaMiddleware]
  const enhancers = [applyMiddleware(...middlewares)]
  const store = createStore(
    rootReducer,
    fromJS(initialState),
    composeEnhancers(...enhancers)
  )
  sagaMiddleware.run(sagas)
  return store
}
