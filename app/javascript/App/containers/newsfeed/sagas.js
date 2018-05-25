import { takeLatest, select } from 'redux-saga/effects'
import { createEntitySagas, createFilterSagas } from '../../lib/redux'
import selectors from './selectors'
import { namespace } from './constants'

const entitySagas = createEntitySagas(namespace)
const filterSagas = createFilterSagas(namespace, selectors, onFilterChange)

export default function* watcher() {
  yield takeLatest('FETCH_ENTITY_LIST', fetchWatchlistEntities)
  yield takeLatest('FETCH_ENTITY_DETAILS', entitySagas.fetchEntityDetails)
  yield takeLatest('SET_ACTIVE_ENTITY', handleFocusChange)
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
  const params = { coin_ids_any }
  yield entitySagas.fetchEntityList({
    ...action,
    entityType: 'newsItems',
    url: 'news_items',
    params
  })
}

function* handleFocusChange(action) {
  if (action.namespace !== namespace) return
  const { type, id } = action.payload
  if (type === 'coin') {
    yield entitySagas.fetchEntityList({
      ...action,
      entityType: 'newsItems',
      url: 'news_items',
      params: { coin_ids_any: id }
    })
  }
}

function onFilterChange({ payload }) {
  console.log('huzzah')
}
