import { createSelector } from 'reselect'
import { filterList } from './constants'

export const selectDomain = () => state => state.icoFilters

export const selectActiveFilters = () =>
  createSelector(selectDomain(), s => {
    return s.get('activeFilters')
  })

export const selectInactiveFilters = () =>
  createSelector(selectDomain(), s => {
    const active = s.get('activeFilters')
    return filterList.filter(
      item => !active.find(o => o.get('key') === item.get('key'))
    )
  })
