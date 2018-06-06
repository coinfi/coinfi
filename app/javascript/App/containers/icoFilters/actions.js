import { namespace } from './constants'
import { createFilterActions } from '../../lib/redux'

export default { ...createFilterActions(namespace) }
