import { namespace } from './constants'
import { createEntityActions, createFilterActions } from '../../lib/redux'

const entityActions = createEntityActions(namespace)
const filterActions = createFilterActions(namespace)

const fetchMoreNewsFeed = () => {
  return { type: 'FETCH_MORE_NEWS_FEED' }
}

export default {
  ...entityActions,
  ...filterActions,
  fetchMoreNewsFeed
}
