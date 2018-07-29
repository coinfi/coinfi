import { fromJS } from 'immutable'

export const namespace = 'newsfeed'

export const filterList = fromJS([
  { key: 'marketMoving', label: 'Market Moving' },
  { key: 'dates', label: 'Date Range' },
  { key: 'publishedSince', label: 'Published Since' },
  { key: 'publishedUntil', label: 'Published Until' },
  { key: 'coins', label: 'Coins' },
  { key: 'categories', label: 'Categories' },
  { key: 'social', label: 'Social Sources' },
  { key: 'feedSources', label: 'General Sources' },
  // { key: 'keywords', label: 'Keywords' },
])
