import { namespace } from './constants'
import { createEntityActions, createFilterActions } from '../../lib/redux'

const entityActions = createEntityActions(namespace)
const filterActions = createFilterActions(namespace)

const fetchMoreNewsFeed = () => {
  return { type: 'FETCH_MORE_NEWS_FEED' }
}

const initializeNewsfeedState = () => {
  return { type: 'INITIALIZE_NEWSFEED_STATE' }
}

export default {
  ...entityActions,
  ...filterActions,
  fetchMoreNewsFeed,
  initializeNewsfeedState
}
