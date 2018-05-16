import { createSelector } from 'reselect'

export const selectDomain = () => state => state.watchlist

export const selectCoinIDs = () =>
  createSelector(selectDomain(), s => {
    return s.get('coinIDs')
  })

export const selectEntities = () =>
  createSelector(selectDomain(), s => {
    return s.get('entities')
  })

export const selectCoins = () =>
  createSelector(selectEntities(), selectCoinIDs(), (entities, ids) => {
    if (!ids) return null
    return ids.map(id => entities.getIn(['coins', `${id}`]))
  })

export const selectWatchedCoins = () => {
  // The Newsfeed will require this
}
