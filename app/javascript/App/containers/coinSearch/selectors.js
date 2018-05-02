import { createSelector } from 'reselect'

export const selectDomain = () => state => state.coinSearch

export const selectSearchedCoins = namespace =>
  createSelector(selectDomain(), s => {
    return s.getIn([namespace, 'searchedCoins']) || []
  })

export const selectSearchText = namespace =>
  createSelector(selectDomain(), s => {
    return s.getIn([namespace, 'searchText']) || ''
  })
