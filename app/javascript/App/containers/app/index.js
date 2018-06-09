/*
 * Any selectors or actions defined here are made globally available.
 */
import { createHOC } from '../../lib/redux'
import * as actions from './actions'
import * as selectors from './selectors'

export default createHOC({
  actions,
  selectors,
  onMount({ props }) {
    props.fetchUser()
  }
})
