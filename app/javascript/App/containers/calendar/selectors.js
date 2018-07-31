import _ from 'lodash'
import { namespace, filterList } from './constants'
import { createEntitySelectors, createFilterSelectors } from '../../lib/redux'

const select = createEntitySelectors(namespace)
const filterSelectors = createFilterSelectors(namespace, filterList)

export default {
  activeEntity: select.activeEntity,
  isActiveEntity: select.isActiveEntity,
  isLoading: select.isLoading,
  coins: select.entities('coins'),
  calendarEvents: select.entities('calendarEvents'),
  sortedCalendarEvents: select.entities('calendarEvents', (entities) => {
    const sortBy = 'date_event'

    return entities.sort((x, y) => {
      return Date.parse(y.get(sortBy)) - Date.parse(x.get(sortBy))
    })
  }),
  tags: select.entities('tags'),
  selectCalendarEventFromList: select.entityFromList('calendarEvents'),
  selectCoinDetails: select.entityDetails('coin'),
  selectNewsCategories: select.entityChildren('calendarEvents', 'categories'),
  coinIDs: (state) => {
    const { user, UI, newsfeed } = state
    let coinIDs = []
    if (user && user.coin_ids) coinIDs = user.coin_ids
    if (!UI.get('watchingOnly')) {
      coinIDs = _.union(coinIDs, newsfeed.getIn(['entityIDs', 'coins']))
    }
    return coinIDs
  },
  endFetchingMoreEntityList: (state) => {
    return state.calendar.get('endFetchingMoreEntityList')
  },
  ...filterSelectors,
}
