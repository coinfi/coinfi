import { namespace } from './constants'
import { createEntityActions, createFilterActions } from '../../lib/redux'

const entityActions = createEntityActions(namespace)
const filterActions = createFilterActions(namespace)

export default {
  ...entityActions,
  ...filterActions
}
