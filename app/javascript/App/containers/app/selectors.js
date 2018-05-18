import { createSelector } from 'reselect'

export const currentUI = createSelector(
  (state) => state.UI,
  (UI) => {
    return (keyPath) => UI.getIn([].concat(keyPath))
  }
)
