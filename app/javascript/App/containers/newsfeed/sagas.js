import { takeLatest, select, put } from 'redux-saga/effects'
import { createEntitySagas, createFilterSagas } from '../../lib/redux'
import selectors from './selectors'
import actions from './actions'
import { namespace } from './constants'

const entitySagas = createEntitySagas(namespace)
const filterSagas = createFilterSagas(namespace, selectors)

export default function* watcher() {
  yield takeLatest('FETCH_ENTITY_LIST', fetchWatchlistEntities)
  yield takeLatest('FETCH_ENTITY_DETAILS', entitySagas.fetchEntityDetails)
  yield takeLatest('SET_ACTIVE_ENTITY', applyCoin)
  yield takeLatest('SET_FILTER', applyCoin)
  yield filterSagas()
}

function* fetchWatchlistEntities(action) {
  if (action.namespace !== namespace) return
  switch (action.entityType) {
    case 'coins':
      yield fetchCoins(action)
      break
    case 'newsItems':
      yield fetchAllNewsItems(action)
      break
    default:
      yield fetchCoins(action)
      yield fetchAllNewsItems(action)
      break
  }
}

function* fetchCoins(action) {
  yield entitySagas.fetchEntityList({
    ...action,
    entityType: 'coins',
    url: 'newsfeed/coins'
  })
}

function* fetchAllNewsItems(action) {
  const coin_ids = yield select(selectors.coinIDs)
  const params = { coin_ids }
  yield fetchNewsItems({ ...action, params })
}

function* fetchNewsItems(action) {
  yield entitySagas.fetchEntityList({
    ...action,
    entityType: 'newsItems',
    url: 'news_items'
  })
}

function* applyCoin(action) {
  const { payload, type } = action
  if (action.namespace !== namespace) return
  if (payload.preventSaga) return
  const preventSaga = true
  switch (type) {
    case 'SET_ACTIVE_ENTITY':
      if (payload.type !== 'coin') return
      let { id, label } = payload
      yield put(
        actions.setFilter({
          key: 'coins',
          value: [{ id, label }],
          preventSaga
        })
      )
      yield fetchNewsItems({ ...action, params: { coin_ids: [id] } })
      break
    case 'SET_FILTER':
      if (payload.key !== 'coins') return
      const coin_ids = payload.value.map((coin) => coin.id)
      if (coin_ids.length > 1) {
        yield put(actions.unsetActiveEntity())
      } else {
        id = coin_ids[0]
        yield put(actions.setActiveEntity({ preventSaga, type: 'coin', id }))
      }
      yield fetchNewsItems({ ...action, params: { coin_ids } })
      break
    default:
      break
  }
}
