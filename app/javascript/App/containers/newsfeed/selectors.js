import { createSelector } from 'reselect'
import { namespace } from './constants'

const selectState = (entityType) => (state) => state[namespace][entityType]

export const coinIDs = createSelector(selectState('coins'), (state) =>
  state.get('result')
)

export const coins = createSelector(selectState('coins'), (state) => {
  const { result, entities } = state.toObject()
  if (!result) return null
  return result.map((id) => entities.getIn(['coins', `${id}`]))
})

export const articles = createSelector(selectState('articles'), (state) =>
  state.getIn(['entities', 'articles'])
)

export const tags = createSelector(selectState('articles'), (state) =>
  state.getIn(['entities', 'tags'])
)
