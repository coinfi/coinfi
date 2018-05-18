import { takeLatest, select } from 'redux-saga/effects'
import { apiSagas, createEntityActions } from '../../lib/redux'
import * as selectors from './selectors'
import { namespace } from './constants'

const actions = createEntityActions(namespace)

export default function* watcher() {
  yield takeLatest('FETCH_ENTITIES', fetchEntities)
}

function* fetchEntities(action) {
  if (action.namespace === namespace) {
    yield apiSagas.get(
      '/newsfeed/coins.json',
      null,
      actions.setEntities('coins')
    )
    const coinIDs = yield select(selectors.coinIDs)
    const q = { coin_id_in: coinIDs.toJS() }
    yield apiSagas.get('/articles.json', { q }, actions.setEntities('articles'))
  }
}
