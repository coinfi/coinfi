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
    fetchEntityList: (entityType) => ({
      type: 'FETCH_ENTITY_LIST',
      ...actionProps(entityType)
    }),
    setEntityList: (entityType, response) => ({
      type: 'SET_ENTITY_LIST',
      ...actionProps(entityType),
      response
    }),
    setCurrentEntity: (payload) => ({
      type: 'SET_ACTIVE_ENTITY',
      namespace,
      payload
    })
  }
}
