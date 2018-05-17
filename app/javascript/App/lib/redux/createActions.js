export default (namespace) => ({
  fetch: (url, params) => ({
    type: 'FETCH',
    namespace,
    url,
    params
  }),
  set: (entityType) => (response) => ({
    type: 'SET',
    namespace,
    entityType,
    response
  })
})
