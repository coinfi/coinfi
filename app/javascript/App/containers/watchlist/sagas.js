import { takeLatest, select, put } from 'redux-saga/effects'
import {
  apiSagas,
  createEntityActions,
  createEntitySagas
} from '../../lib/redux'
import * as selectors from './selectors'
import actions from './actions'
import { namespace } from './constants'

const namespacedEntityActions = createEntityActions(namespace)
const sagas = createEntitySagas(namespace)

export default function* watcher() {
  yield takeLatest('FETCH_ENTITY_LIST', fetchEntityList)
  yield takeLatest('ADD_COIN_SUCCESS', doFetchEntityList)
  yield takeLatest('REMOVE_COIN_SUCCESS', doFetchEntityList)
  yield takeLatest('REMOVE_COIN', removeCoin)
  yield takeLatest('REORDER_COINS', reorderCoins)
}

function* fetchEntityList(action) {
  if (action.namespace !== namespace) return
  yield sagas.fetchEntityList({
    ...action,
    entityType: 'coins',
    url: 'watchlist/coins'
  })
  const coin_id_in = yield select(selectors.coinIDs)
  const params = { coin_id_in }
  yield sagas.fetchEntityList({ ...action, entityType: 'articles', params })
}

function* doFetchEntityList() {
  yield put(namespacedEntityActions.fetchEntityList())
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
