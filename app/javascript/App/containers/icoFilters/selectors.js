import { createSelector } from 'reselect'
import { filterList } from './constants'

const selectState = (state) => state.icoFilters

export const activeFilters = createSelector(selectState, (s) => {
  return s.get('activeFilters')
})

export const availableFilters = createSelector(selectState, (s) => {
  const active = s.get('activeFilters')
  return filterList.filter((item) => {
    if (item.get('disabled') || item.get('unlisted')) return false
    return !active.find((o) => o.get('key') === item.get('key'))
  })
})

export const disabledFilters = createSelector(selectState, (s) => {
  return filterList.filter((item) => {
    return !!item.get('disabled')
  })
})
