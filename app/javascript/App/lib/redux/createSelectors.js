import { createSelector } from 'reselect'

const selectState = (containerName, namespace) => (state) =>
  state[containerName][namespace]

export const selectIDs = (containerName, namespace) => {
  return createSelector(selectState(containerName, namespace), (state) =>
    state.get('result')
  )
}

export const selectEntities = (containerName, namespace, entityID) => {
  entityID = entityID || namespace
  return createSelector(selectState(containerName, namespace), (state) => {
    const { result, entities } = state.toObject()
    if (!result) return null
    return result.map((id) => entities.getIn([entityID, `${id}`]))
  })
}
