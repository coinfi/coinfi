/*
 * This will create a reducer which listens for generic actions such as SET, and
 * return an updated state as long as the "namespace" and "entityType" arguments
 * match. If nothing happened, it proceeds by executing the containerReducer
 * which listens for more specific actions.
 */
import { fromJS } from 'immutable'
import normalizers from '../../normalizers'
import { pluralize } from '../misc'

const initialState = fromJS({
  entityDetails: {},
  entityIDs: {},
  entityList: {}
})

const whitelistedActions = ['SET_ENTITY_LIST', 'SET_ENTITY_DETAILS']

const createEntityReducer = (namespace, containerReducer) => (
  state = initialState,
  action
) => {
  if (!whitelistedActions.includes(action.type)) {
    if (containerReducer) return containerReducer(state, action)
    return state
  }
  const { entityType, response, payload } = action
  if (namespace !== action.namespace) return state
  switch (action.type) {
    case 'SET_ENTITY_LIST':
      const normalizer = normalizers[entityType]
      if (!normalizer) console.error(`No normalizer found for ${entityType}`)
      const normalized = normalizer(response)
      const entityLists = state.get('entityList').mergeDeep(normalized.entities)
      return state
        .set('entityList', entityLists)
        .setIn(['entityIDs', entityType], normalized.result)
    case 'SET_ENTITY_DETAILS':
      const keyPath = ['entityDetails', pluralize(entityType), `${response.id}`]
      let existingDetails = state.getIn(keyPath) || fromJS({})
      return state.setIn(keyPath, existingDetails.mergeDeep(response))
    case 'SET_CURRENT_ENTITY':
      return state.set('currentEntity', fromJS(payload))
    default:
      return state
  }
}

export default createEntityReducer
