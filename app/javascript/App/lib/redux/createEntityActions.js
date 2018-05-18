export default (namespace) => ({
  fetchEntities: (entityType) => ({
    type: 'FETCH_ENTITIES',
    namespace,
    entityType
  }),
  fetchEntity: (entityType) => () => ({
    type: 'FETCH_ENTITY',
    namespace,
    entityType
  }),
  setEntities: (entityType) => (response) => ({
    type: 'SET_ENTITIES',
    namespace,
    entityType,
    response
  })
})
