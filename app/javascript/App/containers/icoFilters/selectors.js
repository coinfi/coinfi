import { createSelector } from 'reselect'
import { filterList } from './constants'

export const selectDomain = () => state => state.icoFilters

export const selectActiveFilters = () =>
  createSelector(selectDomain(), s => {
    return s.get('activeFilters')
  })

export const selectAvailableFilters = () =>
  createSelector(selectDomain(), s => {
    const active = s.get('activeFilters')
    return filterList.filter(item => {
      if (item.get('disabled') || item.get('unlisted')) return false
      return !active.find(o => o.get('key') === item.get('key'))
    })
  })

export const selectDisabledFilters = () =>
  createSelector(selectDomain(), s => {
    return filterList.filter(item => {
      return !!item.get('disabled')
    })
  })
