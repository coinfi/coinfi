import { namespace, filterList } from './constants'
import { createFilterReducer } from '../../lib/redux'

export default createFilterReducer({ namespace, filterList })
