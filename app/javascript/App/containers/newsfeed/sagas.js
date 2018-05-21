import { takeLatest, select } from 'redux-saga/effects'
import { apiSagas, createEntityActions } from '../../lib/redux'
import * as selectors from './selectors'
import { namespace } from './constants'
import _ from 'lodash'
import inflection from 'lodash-inflection'
_.mixin(inflection)

const actions = createEntityActions(namespace)

export default function* watcher() {
  yield takeLatest('FETCH_ENTITIES', fetchEntities)
  yield takeLatest('FETCH_ENTITY', fetchEntity)
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

function* fetchEntity(action) {
  if (action.namespace === namespace) {
    const { entityType, entityID } = action
    yield apiSagas.get(
      `/${_.pluralize(entityType)}/${entityID}.json`,
      null,
      actions.setEntity('coin')
    )
  }
}
