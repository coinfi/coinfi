import { fromJS } from 'immutable'

export const namespace = 'calendar'

export const defaultEvent = 'Upcoming events'
export const events = ['Upcoming events', 'Past events']
export const filterList = fromJS([
  { key: 'events', label: 'Show only' },
  { key: 'eventStatuses', label: 'Event Status' },
  { key: 'dates', label: 'Date Range' },
  { key: 'publishedSince', label: 'Published Since' },
  { key: 'publishedUntil', label: 'Published Until' },
  { key: 'coins', label: 'Coins' },
  { key: 'categories', label: 'Categories' },
  { key: 'confidence', label: 'Confidence' },
])
