import { takeLatest } from 'redux-saga/effects'
import * as sagas from '../../lib/genericSagas'
import * as actions from './actions'

export default function* watcher() {
  yield takeLatest('FETCH_COINS', fetchCoins)
  yield takeLatest('FETCH_ARTICLES', fetchArticles)
  yield takeLatest('SEARCH_COINS', searchCoins)
}

function* fetchCoins() {
  yield sagas.get('/watchlist/coins.json', null, actions.fetchCoinsSuccess)
}

function* fetchArticles() {
  yield sagas.get(
    '/watchlist/articles.json',
    null,
    actions.fetchArticlesSuccess
  )
}

function* searchCoins({ searchText }) {
  yield sagas.get(
    '/coins.json',
    { q: { name_cont: searchText } },
    actions.searchCoinsSuccess
  )
}
