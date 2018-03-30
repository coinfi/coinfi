import { createSelector } from 'reselect'

export const entity = () => state => state.entity

export const selectThing = () =>
  createSelector(selectDomain(), s => {
    return s.get('thing')
  })
