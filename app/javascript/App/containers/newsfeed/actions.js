import { namespace } from './constants'
import { createEntityActions, createFilterActions } from '../../lib/redux'

const entityActions = createEntityActions(namespace)
const filterActions = createFilterActions(namespace)

const scrollBottomToReducer = (scrollBottom) => {
  if (!scrollBottom) return { type: null }

  return { type: 'FETCH_MORE_NEWS_FEED' }
}

const onScrollNewsFeedMobile = (e) => {
  const bufferSpace = 450
  const $this = $(e.currentTarget)

  return scrollBottomToReducer(
    $this.scrollTop() >= $(document).height() - $this.height() - bufferSpace
  )
}

const onScrollNewsFeedDesktop = (e) => {
  const bufferSpace = 350
  const $this = $(e.currentTarget)

  return scrollBottomToReducer(
    $this.get(0).scrollHeight > $this.height() &&
      ($this.scrollTop() + $this.innerHeight() >= $this[0].scrollHeight - bufferSpace)
  )
}

export default {
  ...entityActions,
  ...filterActions,
  scrollBottomToReducer,
  onScrollNewsFeedMobile,
  onScrollNewsFeedDesktop
}
