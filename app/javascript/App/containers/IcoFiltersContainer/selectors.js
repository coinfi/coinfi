import { createSelector } from 'reselect'

export const selectDomain = () => state => state.icoFilters

export const selectActiveFilters = () =>
  createSelector(selectDomain(), s => {
    return s.get('activeFilters')
  })

export const selectUI = () =>
  createSelector(selectDomain(), s => {
    return s.get('UI')
  })
