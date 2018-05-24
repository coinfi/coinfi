import { createHOC } from '../../lib/redux'
import actions from './actions'
import * as selectors from './selectors'

export default createHOC({
  actions,
  selectors,
  onMount: (container) => {
    container.props.fetchEntityList()
  }
})
