/*
 * Selector creators which use the following pattern:
 * 
 * {
 *   newsfeed: {
 *     activeEntity: { id, type },
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

export default (namespace) => {
  const selectState = () => (state) => state[namespace]
  return {
    entityIDs: (entityType) =>
      createSelector(selectState(), (state) =>
        state.getIn(['entityIDs', entityType])
      ),
    entities: (entityType) =>
      createSelector(selectState(), (state) => {
        const ids = state.getIn(['entityIDs', entityType])
        const entities = state.getIn(['entityList', entityType])
        if (!ids || !entities) return []
        return ids.map((id) => entities.get(`${id}`))
      }),
    entityFromList: (entityType) =>
      createSelector(selectState(), (state) => (id) =>
        state.getIn(['entityList', entityType, `${id}`])
      ),
    entityChildren: (entityType, childrenType) =>
      createSelector(selectState(), (state) => (parent) => {
        return parent
          .get(childrenType)
          .map((childID) =>
            state.getIn(['entityList', childrenType, `${childID}`])
          )
      }),
    entityDetails: (entityType) =>
      createSelector(selectState(), (state) => (id) =>
        state.getIn(['entityDetails', pluralize(entityType), `${id}`])
      ),
    activeEntity: createSelector(selectState(), (state) =>
      state.get('activeEntity')
    )
  }
}
