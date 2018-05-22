export default (namespace) => ({
  fetchEntityDetails: (entityType, entityID) => ({
    type: 'FETCH_ENTITY_DETAILS',
    namespace,
    entityType,
    entityID
  }),
  setEntity: (entityType) => (response) => ({
    type: 'SET_ENTITY_DETAILS',
    namespace,
    entityType,
    response
  }),
  fetchEntityList: (entityType) => ({
    type: 'FETCH_ENTITY_LIST',
    namespace,
    entityType
  }),
  setEntities: (entityType) => (response) => ({
    type: 'SET_ENTITY_LIST',
    namespace,
    entityType,
    response
  })
})
