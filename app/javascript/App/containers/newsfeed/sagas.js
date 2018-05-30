import { takeLatest, select, put } from 'redux-saga/effects'
import { createEntitySagas, createFilterSagas } from '../../lib/redux'
import selectors from './selectors'
import actions from './actions'
import { namespace } from './constants'

const entitySagas = createEntitySagas(namespace)
const filterSagas = createFilterSagas(namespace)

export default function* watcher() {
  yield takeLatest('ON_FILTER_INITIALIZE', fetchAll)
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
  let { params } = action
  if (!params) params = { coin_ids: yield select(selectors.coinIDs) }
  yield entitySagas.fetchEntityList({
    ...action,
    params,
    entityType: 'newsItems',
    url: 'news_items'
  })
}

function* applyCoin(action) {
  /* When setting the active coin, this also sets the coin filter, and visa
  versa. */
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
    case 'ON_FILTER_CHANGE':
    case 'ON_FILTER_INITIALIZE':
      let coins = []
      let { filterObject } = payload
      if (filterObject && filterObject.coins) coins = filterObject.coins
      const coin_ids = coins.map((coin) => parseInt(coin.id, 10))
      if (coin_ids.length >= 1) {
        if (coin_ids.length === 1) {
          const id = coin_ids[0]
          yield put(actions.fetchEntityDetails('coin', id))
          yield put(actions.setActiveEntity({ preventSaga, type: 'coin', id }))
        } else {
          yield put(actions.unsetActiveEntity())
        }
        yield fetchNewsItems({ ...action, params: { coin_ids } })
      } else {
        yield fetchNewsItems(action)
      }
      break
    default:
      break
  }
}
