import { select, takeLatest } from 'redux-saga/effects'
import apiSagas from './apiSagas'
import { createEntityActions, createEntitySelectors } from './index'
import { pluralize } from '../misc'

export default (namespace) => {
  function* watcher() {
    yield takeLatest('FETCH_ENTITY_DETAILS', fetchEntityDetails)
    yield takeLatest('FETCH_ENTITY_LIST', fetchEntityList)
    yield takeLatest('FETCH_ENTITY_LIST_UPDATES', fetchEntityListUpdates)
  }

  const actions = createEntityActions(namespace)
  const selectors = createEntitySelectors(namespace)

  function* fetchEntityDetails(action) {
    if (action.namespace !== namespace) return
    const { entityType, entityID, params } = action
    const entityDetailSelector = yield select(
      selectors.entityDetails(namespace, entityType)
    )
    const entityDetails = entityDetailSelector(entityID)
    if (entityDetails) return
    yield apiSagas.get(
      `/${pluralize(entityType)}/${entityID}.json`,
      { q: params },
      (response) => actions.setEntityDetails(entityType, response)
    )
  }

  function* fetchEntityList(action) {
    yield createFetchEntityList(action, actions.setEntityList)
  }

  function* fetchEntityListUpdates(action) {
    yield createFetchEntityList(action, actions.setEntityListUpdates)
  }

  function* createFetchEntityList(action, callbackAction) {
    if (action.namespace !== namespace) return
    const { entityType, url, params } = action
    const endpoint = url || pluralize(entityType)
    yield apiSagas.get(`/${endpoint}.json`, { q: params }, (response) =>
      callbackAction(entityType, response)
    )
  }

  return watcher
}
