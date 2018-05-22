/*
 * Selector creators which use the following pattern:
 * 
 * {
 *   newsfeed: {
 *     entityDetails: {
 *       coins: {}
 *     },
 *     entityIDs: {
 *       coinIDs: []
 *       articles: [],
 *       tags: []
 *     },
 *     entityList: {
 *       coins: {},
 *       articles: {},
 *       tags: {}
 *     }
 *   }
 * }
 */
import { createSelector } from 'reselect'
import { pluralize } from '../misc'

const selectState = (containerName) => (state) => {
  return state[containerName]
}

export const selectIDs = (containerName, entityType) => {
  return createSelector(selectState(containerName), (state) =>
    state.getIn(['entityIDs', entityType])
  )
}

export const selectEntities = (containerName, entityType) => {
  return createSelector(selectState(containerName), (state) => {
    const ids = state.getIn(['entityIDs', entityType])
    const entities = state.getIn(['entityList', entityType])
    if (!ids || !entities) return null
    return ids.map((id) => entities.get(`${id}`))
  })
}

export const selectEntityFromList = (containerName, entityType) =>
  createSelector(selectState(containerName), (state) => (id) =>
    state.getIn(['entityList', entityType, `${id}`])
  )

export const selectEntityChildren = (containerName, entityType, childrenType) =>
  createSelector(selectState(containerName), (state) => (parent) => {
    return parent
      .get(childrenType)
      .map((childID) => state.getIn(['entityList', childrenType, `${childID}`]))
  })

export const selectEntityDetails = (containerName, entityType) =>
  createSelector(selectState(containerName), (state) => (id) =>
    state.getIn(['entityDetails', pluralize(entityType), `${id}`])
  )
