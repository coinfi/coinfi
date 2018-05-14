import { createSelector } from 'reselect'

export const selectDomain = () => state => state.coinCharts

export const selectSymbol = () =>
  createSelector(selectDomain(), s => {
    return s.get('symbol')
  })

export const selectPrices = () =>
  createSelector(selectDomain(), s => {
    return s.getIn(['data', 'prices'])
  })

export const selectArticles = () =>
  createSelector(selectDomain(), s => {
    return s.getIn(['data', 'articles'])
  })
