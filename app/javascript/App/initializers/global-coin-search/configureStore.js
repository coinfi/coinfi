import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { fromJS } from 'immutable'
import createSagaMiddleware from 'redux-saga'
import CoinSearchReducer from '../../containers/CoinSearchContainer/reducer'
import sagas from './configureSagas'

const sagaMiddleware = createSagaMiddleware()

export default function configureStore(initialState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const rootReducer = combineReducers({
    coinSearch: CoinSearchReducer
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
