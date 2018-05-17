import reduxHOC from '../../utils/reduxHOC'
import * as actions from './actions'
import * as selectors from './selectors'

export default reduxHOC({
  actions,
  selectors,
  onMount: (container) => {
    container.props.fetchNewsfeed()
  }
})
