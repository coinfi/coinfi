import { fromJS } from 'immutable'

export const namespace = 'newsfeed'

export const filterList = fromJS([
  {
    key: 'search',
    label: 'Search',
    unlisted: true
  },
  { key: 'coins', label: 'Coins' },
  { key: 'feedSources', label: 'Feed Sources' },
  { key: 'categories', label: 'Categories' }
])
