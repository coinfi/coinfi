import { takeLatest, select, put } from 'redux-saga/effects'
import { apiSagas, createEntityActions } from '../../lib/redux'
import * as selectors from './selectors'
import * as actions from './actions'
import { namespace } from './constants'

const namespacedEntityActions = createEntityActions(namespace)

export default function* watcher() {
  yield takeLatest('FETCH_ENTITIES', fetchEntities)
  yield takeLatest('ADD_COIN_SUCCESS', doFetchEntities)
  yield takeLatest('REMOVE_COIN', removeCoin)
  yield takeLatest('REMOVE_COIN_SUCCESS', doFetchEntities)
  yield takeLatest('REORDER_COINS', reorderCoins)
}

function* fetchEntities(action) {
  if (action.namespace !== namespace) return
  yield apiSagas.get(
    '/watchlist/coins.json',
    null,
    namespacedEntityActions.setEntities('coins')
  )
  const coinIDs = yield select(selectors.coinIDs)
  const q = { coin_id_in: coinIDs.toJS() }
  yield apiSagas.get(
    '/articles.json',
    { q },
    namespacedEntityActions.setEntities('articles')
  )
}

function* doFetchEntities() {
  yield put(namespacedEntityActions.fetchEntities())
}

function* removeCoin({ id }) {
  yield apiSagas.destroy(
    `/watchlist/coins/${id}.json`,
    null,
    actions.removeCoinSuccess
  )
}

function* reorderCoins({ order }) {
  yield apiSagas.patch(
    '/watchlist/coins.json',
    { order },
    actions.reorderCoinsSuccess
  )
}
