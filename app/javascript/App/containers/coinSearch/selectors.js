import { createSelector } from 'reselect'

export const selectDomain = () => state => state.coinSearch

export const selectSearchedCoins = () =>
  createSelector(selectDomain(), s => {
    return s.get('searchedCoins')
  })

export const selectSearchText = () =>
  createSelector(selectDomain(), s => {
    return s.get('searchText')
  })
