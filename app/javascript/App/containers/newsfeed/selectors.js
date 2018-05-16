import { createSelector } from 'reselect'

export const selectDomain = namespace => state => state.newsfeed[namespace]

export const selectCoinIDs = () =>
  createSelector(selectDomain('coins'), state => state.get('result'))

export const selectCoins = () =>
  createSelector(selectDomain('coins'), state => {
    const { result, entities } = state.toObject()
    if (!result) return null
    return result.map(id => entities.getIn(['coins', `${id}`]))
  })

export const selectArticles = () =>
  createSelector(selectDomain('articles'), state =>
    state.getIn(['entities', 'articles'])
  )

export const selectTags = () =>
  createSelector(selectDomain('articles'), state =>
    state.getIn(['entities', 'tags'])
  )
