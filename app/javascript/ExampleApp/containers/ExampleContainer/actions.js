export const fetchEntity = id => {
  return { type: 'FETCH_ENTITY', id }
}

export const fetchEntitySuccess = response => {
  return { type: 'FETCH_ENTITY_SUCCESS', response }
}
