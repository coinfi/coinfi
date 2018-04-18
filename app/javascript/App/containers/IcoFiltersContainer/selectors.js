import { createSelector } from 'reselect'

export const selectDomain = () => state => state.icoFilters

export const selectUI = () =>
  createSelector(selectDomain(), s => {
    return s.get('UI')
  })
