import { takeLatest, select, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { createEntitySagas, createFilterSagas } from '../../lib/redux'
import selectors from './selectors'
import actions from './actions'
import { namespace } from './constants'
import { buildFilterObject } from '../../lib/stateHelpers'

const entitySagas = createEntitySagas(namespace)
const filterSagas = createFilterSagas(namespace)

export default function* watcher() {
  yield takeLatest('ON_FILTER_INITIALIZE', fetchAll)
  yield takeLatest('ON_FILTER_INITIALIZE', pollNewsItems)
  yield takeLatest('FETCH_ENTITY_DETAILS', entitySagas.fetchEntityDetails)
  yield takeLatest('SET_ACTIVE_ENTITY', applyCoin)
  yield takeLatest('ON_FILTER_CHANGE', applyCoin)
  yield filterSagas()
}

function* fetchAll(action) {
  if (action.namespace !== namespace) return
  yield fetchCoins(action)
  yield applyCoin(action)
}

function* fetchCoins(action) {
  yield entitySagas.fetchEntityList({
    ...action,
    entityType: 'coins',
    url: 'newsfeed/coins'
  })
}

function* fetchNewsItems(action) {
  const activeFilters = yield select(selectors.activeFilters)
  const { coins, ...params } = buildFilterObject(activeFilters)
  if (coins) {
    params.coin_ids = coins.map((coin) => coin.id)
  } else {
    params.coin_ids = yield select(selectors.coinIDs)
  }
  yield entitySagas.fetchEntityList({
    ...action,
    params,
    entityType: 'newsItems',
    url: 'news_items'
  })
}

function* pollNewsItems(action) {
  while (true) {
    yield delay(90000)
    yield fetchNewsItems(action)
  }
}

function* applyCoin(action) {
  /* When setting the active coin, this also sets the coin filter, and vice
  versa. */
  const { payload, type } = action
  if (action.namespace !== namespace) return
  if (payload.preventSaga) return
  const preventSaga = true
  switch (type) {
    case 'SET_ACTIVE_ENTITY':
      if (payload.type !== 'coin') return
      let { id, label } = payload
      // When we click a coin, set the coin filter
      yield put(
        actions.setFilter({
          key: 'coins',
          value: [{ id, label }],
          preventSaga
        })
      )
      yield fetchNewsItems(action)
      break
    case 'ON_FILTER_CHANGE':
    case 'ON_FILTER_INITIALIZE':
      let { filterObject } = payload
      const params = filterObject || {}
      let coin_ids
      if (params.coins) {
        coin_ids = params.coins.map((coin) => parseInt(coin.id, 10))
      }
      if (coin_ids && coin_ids.length >= 1) {
        if (coin_ids.length === 1) {
          // When there's 1 coin selected, make it the active entity
          const id = coin_ids[0]
          yield put(actions.fetchEntityDetails('coin', id))
          yield put(actions.setActiveEntity({ preventSaga, type: 'coin', id }))
        } else {
          // Unset the active coin if multiple are selected
          yield put(actions.unsetActiveEntity())
        }
      } else {
        // Unset the active coin if none are selected
        yield put(actions.unsetActiveEntity())
      }
      yield fetchNewsItems(action)
      break
    default:
      break
  }
}
