import { createSelector } from 'reselect'

const selectState = (state) => state.coinSearch

export const searchedCoins = (namespace) =>
  createSelector(selectState, (s) => {
      console.log('new coin', s.getIn([namespace, 'searchedCoins']))
    return s.getIn([namespace, 'searchedCoins']) || []
  })

export const searchText = (namespace) =>
  createSelector(selectState, (s) => {
    return s.getIn([namespace, 'searchText']) || ''
  })
