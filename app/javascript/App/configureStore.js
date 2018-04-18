import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { fromJS } from 'immutable'
import createSagaMiddleware from 'redux-saga'
import WatchlistPageReducer from './containers/WatchlistPageContainer/reducer'
import CoinSearchReducer from './containers/CoinSearchContainer/reducer'
import IcoFiltersReducer from './containers/IcoFiltersContainer/reducer'
import sagas from './configureSagas'

const sagaMiddleware = createSagaMiddleware()

export default function configureStore(initialState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const rootReducer = combineReducers({
    watchlist: WatchlistPageReducer,
    coinSearch: CoinSearchReducer,
    icoFilters: IcoFiltersReducer
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
