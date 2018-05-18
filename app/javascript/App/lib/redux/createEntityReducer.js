/*
 * This will create a reducer which listens for generic actions such as SET, and
 * return an updated state as long as the "namespace" and "entityType" arguments
 * match. If nothing happened, it proceeds by executing the containerReducer
 * which listens for more specific actions.
 */
import { fromJS } from 'immutable'
import normalizers from '../../normalizers'

const initialState = fromJS({
  entities: {},
  ids: {}
})

const whitelistedActions = ['SET_ENTITIES', 'SET_ENTITY']

const createEntityReducer = (namespace, containerReducer) => (
  state = initialState,
  action
) => {
  if (!whitelistedActions.includes(action.type)) {
    if (containerReducer) return containerReducer(state, action)
    return state
  }
  const { entityType } = action
  if (namespace !== action.namespace) return state
  switch (action.type) {
    case 'SET_ENTITIES':
      const normalizer = normalizers[entityType]
      if (!normalizer) console.error(`No normalizer found for ${entityType}`)
      const normalized = normalizer(action.response)
      return state
        .set('entities', state.get('entities').mergeDeep(normalized.entities))
        .setIn(['ids', entityType], fromJS(normalized.result))
    default:
      return state
  }
}

export default createEntityReducer
