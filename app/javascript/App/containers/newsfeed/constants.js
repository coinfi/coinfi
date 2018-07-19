import {fromJS} from 'immutable'

export const namespace = 'newsfeed'

export const filterList = fromJS([
  {key: 'marketMoving', label: 'Market Moving'},
  {key: 'publishedSince', label: 'Published Since'},
  {key: 'publishedUntil', label: 'Published Until'},
  {key: 'coins', label: 'Coins'},
  {key: 'feedSources', label: 'Feed Sources'},
  {key: 'categories', label: 'Categories'},
  {key: 'keywords', label: 'Keywords'},
])
