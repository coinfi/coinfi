import { createSelector } from 'reselect'

export const coin = () => state => state.coin

export const selectThing = () =>
  createSelector(selectDomain(), s => {
    return s.get('thing')
  })
