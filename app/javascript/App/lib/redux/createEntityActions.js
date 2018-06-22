import { pluralize } from '../misc'

export default (namespace) => {
  const actionProps = (entityType) => ({
    namespace,
    entityType: entityType ? pluralize(entityType) : null
  })
  return {
    fetchEntityDetails: (entityType, entityID) => ({
      type: 'FETCH_ENTITY_DETAILS',
      ...actionProps(entityType),
      entityID
    }),
    setEntityDetails: (entityType, response) => ({
      type: 'SET_ENTITY_DETAILS',
      ...actionProps(entityType),
      response
    }),
    fetchEntityList: (entityType, opts = {}) => ({
      type: 'FETCH_ENTITY_LIST',
      ...actionProps(entityType),
      ...opts
    }),
    setEntityList: (entityType, response) => ({
      type: 'SET_ENTITY_LIST',
      ...actionProps(entityType),
      response
    }),
    fetchEntityListUpdates: (entityType, opts = {}) => ({
      type: 'FETCH_ENTITY_LIST_UPDATES',
      ...actionProps(entityType),
      ...opts
    }),
    setEntityListUpdates: (entityType, response) => ({
      type: 'SET_ENTITY_LIST_UPDATES',
      ...actionProps(entityType),
      response
    }),
    setActiveEntity: (payload) => ({
      type: 'SET_ACTIVE_ENTITY',
      namespace,
      payload
    }),
    unsetActiveEntity: () => ({
      type: 'UNSET_ACTIVE_ENTITY',
      namespace
    }),
    fetchMoreEntityList: (entityType, opts = {}) => ({
      type: 'FETCH_MORE_ENTITY_LIST',
      ...actionProps(entityType),
      ...opts
    }),
    setMoreEntityList: (entityType, response) => ({
      type: 'SET_MORE_ENTITY_LIST',
      ...actionProps(entityType),
      response
    }),
  }
}
