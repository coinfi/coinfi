import { namespace } from './constants'
import { createEntityActions } from '../../lib/redux'
const entityActions = createEntityActions(namespace)

export default {
  ...entityActions
}
