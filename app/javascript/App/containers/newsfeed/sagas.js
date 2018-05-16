import { takeLatest, select } from 'redux-saga/effects'
import * as sagas from '../../utils/genericSagas'
import * as actions from './actions'
import * as selectors from './selectors'

export default function* watcher() {
  yield takeLatest('FETCH_NEWSFEED_COINS', fetchCoins)
  yield takeLatest('FETCH_NEWSFEED_ARTICLES', fetchArticles)
}

function* fetchCoins() {
  yield sagas.get('/coins.json', { scope: 'top20' }, actions.fetchCoinsSuccess)
}

function* fetchArticles() {
  const q = {
    // coin_ids_in: yield select(selectors.selectCoinIDs)
    coin_ids_in: []
  }
  yield sagas.get('/articles.json', q, actions.fetchArticlesSuccess)
}
