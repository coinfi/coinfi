import { createSelector } from 'reselect'

export const selectDomain = () => state => state

export const selectUI = () =>
  createSelector(selectDomain(), s => {
    return s.UI
  })
