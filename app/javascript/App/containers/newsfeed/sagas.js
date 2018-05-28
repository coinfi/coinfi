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
  yield filterSagas
}

function* fetchWatchlistEntities(action) {
  if (action.namespace !== namespace) return
  switch (action.entityType) {
    case 'coins':
      yield fetchCoins(action)
      break
    case 'newsItems':
      yield fetchNewsItems(action)
      break
    default:
      yield fetchCoins(action)
      yield fetchNewsItems(action)
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

function* fetchNewsItems(action) {
  const coin_ids_any = yield select(selectors.coinIDs)
  const params = action.params || { coin_ids_any }
  yield entitySagas.fetchEntityList({
    ...action,
    entityType: 'newsItems',
    url: 'news_items',
    params
  })
}

function* applyCoin(action) {
  const { payload, type, preventSaga } = action
  if (action.namespace !== namespace) return
  if (preventSaga) return
  switch (type) {
    case 'SET_ACTIVE_ENTITY':
      if (payload.type !== 'coin') return
      yield put(
        actions.setFilter({ key: 'coins', value: ['asd'], preventSaga: true })
      )
      break
    case 'SET_FILTER':
      if (payload.key !== 'coins') return
      yield put(
        actions.setActiveEntity({ type: 'coin', id: 0, preventSaga: true })
      )
      break
    default:
      break
  }
  yield fetchNewsItems({ ...action, params: { coin_ids_any: payload.id } })
}
