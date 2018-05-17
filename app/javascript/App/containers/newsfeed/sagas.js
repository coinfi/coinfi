import { takeLatest, select } from 'redux-saga/effects'
import * as sagas from '../../utils/genericSagas'
import * as actions from './actions'
import * as selectors from './selectors'

export default function* watcher() {
  yield takeLatest('FETCH_NEWSFEED', fetchNewsfeed)
}

function* fetchNewsfeed() {
  yield sagas.get('/newsfeed/coins.json', null, actions.fetchCoinsSuccess)
  const coinIDs = yield select(selectors.selectCoinIDs())
  const q = { coin_id_in: coinIDs.toJS() }
  yield sagas.get('/articles.json', { q }, actions.fetchArticlesSuccess)
}
