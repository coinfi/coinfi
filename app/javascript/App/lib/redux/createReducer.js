/*
 * This will create a reducer which listens for generic actions such as SET, and
 * return an updated state as long as the "namespace" and "entityType" arguments
 * match. If nothing happened, it proceeds by executing the containerReducer
 * which listens for more specific actions.
 */
import { fromJS } from 'immutable'
import normalizers from '../../normalizers'

const initialState = fromJS({})

const whitelistedActions = ['SET']

const createReducer = (namespace, entityType, containerReducer) => (
  state = initialState,
  action
) => {
  if (
    !whitelistedActions.includes(action.type) ||
    action.namespace !== namespace ||
    action.entityType !== entityType
  ) {
    if (containerReducer) containerReducer(state, action)
    return state
  }
  const normalizer = normalizers[entityType]
  if (!normalizer) console.error(`No normalizer found for ${entityType}`)
  switch (action.type) {
    case 'SET':
      return state.mergeDeep(normalizer(action.response))
    default:
      return state
  }
}

export default createReducer
