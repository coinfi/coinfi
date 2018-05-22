import { takeLatest, select } from 'redux-saga/effects'
import { createEntitySagas } from '../../lib/redux'
import * as selectors from './selectors'
import { namespace } from './constants'

const sagas = createEntitySagas(namespace)

export default function* watcher() {
  yield takeLatest('FETCH_ENTITY_LIST', fetchEntityList)
  yield takeLatest('FETCH_ENTITY_DETAILS', sagas.fetchEntityDetails)
}

function* fetchEntityList(action) {
  if (action.namespace !== namespace) return
  yield sagas.fetchEntityList({
    ...action,
    entityType: 'coins',
    url: 'newsfeed/coins'
  })
  const coinIDs = yield select(selectors.coinIDs)
  const params = { coin_id_in: coinIDs.toJS() }
  yield sagas.fetchEntityList({ ...action, entityType: 'articles', params })
}
