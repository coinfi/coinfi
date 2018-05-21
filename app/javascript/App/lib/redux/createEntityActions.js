export default (namespace) => ({
  fetchEntities: (entityType) => ({
    type: 'FETCH_ENTITIES',
    namespace,
    entityType
  }),
  fetchEntity: (entityType, entityID) => ({
    type: 'FETCH_ENTITY',
    namespace,
    entityType,
    entityID
  }),
  setEntities: (entityType) => (response) => ({
    type: 'SET_ENTITIES',
    namespace,
    entityType,
    response
  }),
  setEntity: (entityType) => (response) => ({
    type: 'SET_ENTITY',
    namespace,
    entityType,
    response
  })
})
