import { takeLatest, select } from 'redux-saga/effects'
import * as sagas from '../../utils/genericSagas'
import * as actions from './actions'
import * as selectors from './selectors'

export default function* watcher() {
  yield takeLatest('FETCH_WATCHLIST', fetchWatchlist)
  yield takeLatest('ADD_COIN_SUCCESS', fetchWatchlist)
  yield takeLatest('REMOVE_COIN', removeCoin)
  yield takeLatest('REORDER_COINS', reorderCoins)
}

function* fetchWatchlist() {
  yield sagas.get('/watchlist/coins.json', null, actions.fetchCoinsSuccess)
  const coinIDs = yield select(selectors.selectCoinIDs())
  const q = { coin_id_in: coinIDs.toJS() }
  yield sagas.get('/articles.json', { q }, actions.fetchArticlesSuccess)
}

function* removeCoin({ id }) {
  yield sagas.destroy(
    `/watchlist/coins/${id}.json`,
    null,
    actions.removeCoinSuccess
  )
}

function* reorderCoins({ order }) {
  yield sagas.patch(
    '/watchlist/coins.json',
    { order },
    actions.reorderCoinsSuccess
  )
}
