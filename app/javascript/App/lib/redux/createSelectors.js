import { createSelector } from 'reselect'

const selectState = (containerName, namespace) => (state) => {
  return state[containerName][namespace]
}

export const selectIDs = (containerName, namespace) => {
  return createSelector(selectState(containerName, namespace), (state) =>
    state.get('result')
  )
}

export const selectEntities = (containerName, namespace, entityType) => {
  return createSelector(selectState(containerName, namespace), (state) => {
    const { result, entities } = state.toObject()
    if (!result || !entities) return null
    if (entityType) return entities.get(entityType)
    return result.map((id) => entities.getIn([namespace, `${id}`]))
  })
}

export const selectEntity = (containerName, namespace, entityType) =>
  createSelector(selectState(containerName, namespace), (state) => (id) =>
    state.getIn(['entities', entityType, `${id}`])
  )
