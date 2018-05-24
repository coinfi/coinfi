/*
 * This will create a reducer which listens for generic actions such as SET, and
 * return an updated state as long as the "namespace" and "entityType" arguments
 * match. If nothing happened, it proceeds by executing the containerReducer
 * which listens for more specific actions.
 */
import { fromJS } from 'immutable'
import normalizers from '../../normalizers'
import { pluralize } from '../misc'
import initialState from './initialState'

const createEntityReducer = (namespace) => (state = initialState, action) => {
  if (namespace !== action.namespace) return state
  const { entityType, response, payload } = action
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
    case 'SET_ACTIVE_ENTITY':
      return state.set('activeEntity', payload)
    default:
      return state
  }
}

export default createEntityReducer
