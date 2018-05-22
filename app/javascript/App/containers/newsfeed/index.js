import { createHOC } from '../../lib/redux'
import * as actions from './actions'
import * as selectors from './selectors'
import { namespace } from './constants'

export default createHOC({
  namespace,
  actions,
  selectors,
  onMount: (container) => {
    container.props.fetchEntityList()
  }
})
