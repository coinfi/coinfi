import { createSelector } from 'reselect'

export const selectDomain = () => state => state.coinCharts

export const selectPrices = () =>
  createSelector(selectDomain(), s => {
    return s.get('prices')
  })

export const selectArticles = () =>
  createSelector(selectDomain(), s => {
    return s.get('articles')
  })
