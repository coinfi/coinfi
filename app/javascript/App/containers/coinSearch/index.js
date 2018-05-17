import reduxHOC from '../../utils/reduxHOC'
import * as actions from './actions'
import * as selectors from './selectors'

export default (namespace = 'global') =>
  reduxHOC({
    actions: {
      searchCoins: actions.searchCoins(namespace),
      searchCoinsSuccess: actions.searchCoinsSuccess(namespace),
      clearSearch: actions.clearSearch(namespace)
    },
    selectors: {
      searchedCoins: selectors.searchedCoins(namespace),
      searchText: selectors.searchText(namespace)
    }
  })
