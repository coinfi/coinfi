/*
 * Any selectors or actions defined here are made globally available.
 */
import reduxHOC from '../../utils/reduxHOC'
import * as actions from './actions'
import * as selectors from './selectors'

export default reduxHOC({
  actions,
  selectors
})
