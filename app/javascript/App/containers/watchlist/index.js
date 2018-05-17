import genericHocContainer from '../../utils/genericHocContainer'
import * as actions from './actions'
import * as selectors from './selectors'

export default genericHocContainer({
  actions,
  selectors,
  onMount: (container) => {
    container.props.fetchWatchlist()
  }
})
