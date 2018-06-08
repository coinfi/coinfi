/*
 * This will create a reducer which listens for generic actions such as SET, and
 * return an updated state as long as the "namespace" and "entityType" arguments
 * match. If nothing happened, it proceeds by executing the containerReducer
 * which listens for more specific actions.
 */
import { fromJS } from 'immutable'
import normalizers from '../../normalizers'
import { pluralize, singularize } from '../misc'
import initialState from './initialState'
import _ from 'lodash'

const createEntityReducer = (namespace) => (state = initialState, action) => {
  if (namespace !== action.namespace) return state
  const { entityType, response, payload } = action
  let normalizer, normalized, entityLists
  switch (action.type) {
    case 'FETCH_ENTITY_DETAILS':
      return state.setIn(['loadingEntities', singularize(entityType)], true)
    case 'SET_ENTITY_DETAILS':
      const keyPath = ['entityDetails', pluralize(entityType), `${response.id}`]
      let existingDetails = state.getIn(keyPath) || fromJS({})
      return state
        .setIn(keyPath, existingDetails.mergeDeep(response))
        .setIn(['loadingEntities', singularize(entityType)], false)
    case 'FETCH_ENTITY_LIST':
      if (action.isPolling) return state
      return state.setIn(['loadingEntities', entityType], true)
    case 'SET_ENTITY_LIST':
      normalizer = normalizers[entityType]
      if (!normalizer) console.error(`No normalizer found for ${entityType}`)
      normalized = normalizer(response)
      entityLists = state.get('entityList').mergeDeep(normalized.entities)
      return state
        .set('entityList', entityLists)
        .setIn(['entityIDs', entityType], normalized.result)
        .setIn(['loadingEntities', entityType], false)
    case 'SET_ENTITY_LIST_UPDATES':
      normalizer = normalizers[entityType]
      if (!normalizer) console.error(`No normalizer found for ${entityType}`)
      normalized = normalizer(response)
      entityLists = state.get('entityList').mergeDeep(normalized.entities)
      const ids = _.union(
        normalized.result,
        state.getIn(['entityIDs', entityType])
      )
      return state
        .set('entityList', entityLists)
        .setIn(['entityIDs', entityType], ids)
    case 'SET_ACTIVE_ENTITY':
      return state.set('activeEntity', payload)
    case 'UNSET_ACTIVE_ENTITY':
      return state.set('activeEntity', null)
    default:
      return state
  }
}

export default createEntityReducer
