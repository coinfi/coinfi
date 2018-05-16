import { takeLatest, select } from 'redux-saga/effects'
import * as sagas from '../../utils/genericSagas'
import * as actions from './actions'
import * as selectors from './selectors'

export default function* watcher() {
  yield takeLatest('FETCH_COINS', fetchCoins)
  yield takeLatest('FETCH_ARTICLES', fetchArticles)
  yield takeLatest('ADD_COIN_SUCCESS', addCoinSuccess)
  yield takeLatest('REMOVE_COIN', removeCoin)
  yield takeLatest('REORDER_COINS', reorderCoins)
}

function* fetchCoins() {
  yield sagas.get('/watchlist/coins.json', null, actions.fetchCoinsSuccess)
}

function* removeCoin({ id }) {
  yield sagas.destroy(
    `/watchlist/coins/${id}.json`,
    null,
    actions.removeCoinSuccess
  )
}

function* fetchArticles() {
  const q = {
    coin_ids_in: yield select(selectors.selectCoinIDs)
  }
  yield sagas.get('/articles.json', { q }, actions.fetchArticlesSuccess)
}

function* reorderCoins({ order }) {
  yield sagas.patch(
    '/watchlist/coins.json',
    { order },
    actions.reorderCoinsSuccess
  )
}

function* addCoinSuccess() {
  yield fetchCoins()
  yield fetchArticles()
}
