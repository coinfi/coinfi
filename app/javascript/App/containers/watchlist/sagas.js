import { takeLatest, select } from 'redux-saga/effects'
import { apiSagas, createEntityActions } from '../../lib/redux'
import * as selectors from './selectors'
import { namespace } from './constants'

const actions = createEntityActions(namespace)

export default function* watcher() {
  yield takeLatest('FETCH_ENTITIES', fetchEntities)
  yield takeLatest('ADD_COIN_SUCCESS', fetchWatchlist)
  yield takeLatest('REMOVE_COIN', removeCoin)
  yield takeLatest('REORDER_COINS', reorderCoins)
}

function* fetchEntities(action) {
  if (action.namespace === namespace) yield fetchWatchlist()
}

function* fetchWatchlist() {
  yield apiSagas.get(
    '/watchlist/coins.json',
    null,
    actions.setEntities('coins')
  )
  const coinIDs = yield select(selectors.coinIDs)
  const q = { coin_id_in: coinIDs.toJS() }
  yield apiSagas.get('/articles.json', { q }, actions.setEntities('articles'))
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
