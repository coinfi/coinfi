import { takeLatest } from 'redux-saga/effects'
import * as sagas from '../../lib/genericSagas'
import * as actions from './actions'

export default function* watcher() {
  yield takeLatest('FETCH_COINS', fetchCoins)
  yield takeLatest('FETCH_ARTICLES', fetchArticles)
  yield takeLatest('SEARCH_COINS', searchCoins)
  yield takeLatest('ADD_COIN_SUCCESS', addCoinSuccess)
  yield takeLatest('REMOVE_COIN', removeCoin)
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
  yield sagas.get(
    '/watchlist/articles.json',
    null,
    actions.fetchArticlesSuccess
  )
}

function* searchCoins({ searchText }) {
  if (searchText.length < 2) return
  yield sagas.get(
    '/coins.json',
    { q: { name_cont: searchText }, exclude_watched: true },
    actions.searchCoinsSuccess
  )
}

function* addCoinSuccess() {
  yield fetchCoins()
  yield fetchArticles()
}
