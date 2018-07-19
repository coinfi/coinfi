import {namespace, filterList} from './constants'
import {createFilterSelectors} from '../../lib/redux'

const selectors = createFilterSelectors(namespace, filterList)

export default selectors
