import {createSelector} from 'reselect'

export const currentUI = createSelector(
  state => state.UI,
  UI => {
    return keyPath => UI.getIn([].concat(keyPath))
  },
)

export const user = state => state.user
export const isWatching = state => coinID =>
  state.user && state.user.get('coin_ids').includes(coinID)
