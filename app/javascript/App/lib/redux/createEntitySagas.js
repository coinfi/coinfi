import apiSagas from './apiSagas'
import createEntityActions from './createEntityActions'
import { pluralize } from '../misc'

export default (namespace) => {
  const actions = createEntityActions(namespace)
  return {
    *fetchEntityDetails(action) {
      if (action.namespace !== namespace) return
      const { entityType, entityID, params } = action
      yield apiSagas.get(
        `/${pluralize(entityType)}/${entityID}.json`,
        { q: params },
        actions.setEntity(pluralize(entityType))
      )
    },
    *fetchEntityList(action) {
      if (action.namespace !== namespace) return
      const { entityType, url, params } = action
      const endpoint = url || pluralize(entityType)
      yield apiSagas.get(
        `/${endpoint}.json`,
        { q: params },
        actions.setEntities(pluralize(entityType))
      )
    }
  }
}
