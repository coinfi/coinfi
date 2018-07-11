import { takeLatest, select, put, fork } from 'redux-saga/effects'
import { apiSagas, createEntitySagas } from '../../lib/redux'
import selectors from './selectors'
import actions from './actions'
import { namespace } from './constants'

const entitySagas = createEntitySagas(namespace)

export default function* watcher() {
  yield takeLatest('FETCH_COINS', fetchCoins)
  yield takeLatest('SET_ENTITY_LIST', fetchNewsItems)
  yield takeLatest('ADD_COIN_SUCCESS', fetchCoins)
  yield takeLatest('REMOVE_COIN_SUCCESS', fetchCoins)
  yield takeLatest('REMOVE_COIN', removeCoin)
  yield takeLatest('REORDER_COINS', reorderCoins)
  yield fork(entitySagas)
}

function* fetchCoins(action) {
    console.log('watchlist sagas')
  yield put(
    actions.fetchEntityList('coins', {
      entityType: 'coins',
      url: 'watchlist/coins'
    })
  )
}

function* fetchNewsItems(action) {
  if (action.namespace !== namespace) return
  if (action.entityType !== 'coins') return
  const coinIDs = yield select(selectors.coinIDs)
  if (coinIDs.length === 0) return
  const params = { coinIDs }
  yield put(
    actions.fetchEntityList('newsItems', {
      url: 'news_items',
      params
    })
  )
}

function* removeCoin({ id }) {
  yield apiSagas.destroy(
    `/watchlist/coins/${id}.json`,
    null,
    actions.removeCoinSuccess
  )
}

function* reorderCoins({ payload }) {
  yield apiSagas.patch(
    '/watchlist/coins.json',
    { order: payload },
    actions.reorderCoinsSuccess
  )
}
