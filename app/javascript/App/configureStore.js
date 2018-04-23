import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { fromJS } from 'immutable'
import createSagaMiddleware from 'redux-saga'
import appReducer from './containers/app/reducer'
import watchlistPageReducer from './containers/watchlistPage/reducer'
import coinSearchReducer from './containers/coinSearch/reducer'
import icoFiltersReducer from './containers/icoFilters/reducer'
import sagas from './configureSagas'

const sagaMiddleware = createSagaMiddleware()

export default function configureStore(initialState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const rootReducer = combineReducers({
    app: appReducer,
    watchlist: watchlistPageReducer,
    coinSearch: coinSearchReducer,
    icoFilters: icoFiltersReducer
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
