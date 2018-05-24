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

const selectState = (namespace) => (state) => {
  return state[namespace]
}

export const selectIDs = (namespace, entityType) => {
  return createSelector(selectState(namespace), (state) =>
    state.getIn(['entityIDs', entityType])
  )
}

export const selectEntities = (namespace, entityType) => {
  return createSelector(selectState(namespace), (state) => {
    const ids = state.getIn(['entityIDs', entityType])
    const entities = state.getIn(['entityList', entityType])
    if (!ids || !entities) return []
    return ids.map((id) => entities.get(`${id}`))
  })
}

export const selectEntityFromList = (namespace, entityType) =>
  createSelector(selectState(namespace), (state) => (id) =>
    state.getIn(['entityList', entityType, `${id}`])
  )

export const selectEntityChildren = (namespace, entityType, childrenType) =>
  createSelector(selectState(namespace), (state) => (parent) => {
    return parent
      .get(childrenType)
      .map((childID) => state.getIn(['entityList', childrenType, `${childID}`]))
  })

export const selectEntityDetails = (namespace, entityType) =>
  createSelector(selectState(namespace), (state) => (id) =>
    state.getIn(['entityDetails', pluralize(entityType), `${id}`])
  )
