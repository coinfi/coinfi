import { createSelector } from 'reselect'

export const selectDomain = state => state

export const currentUI = createSelector(
  state => state.UI,
  UI => {
    return (key, val = null) => {
      if (!val) return UI.get(key)
      return UI.get(key) === val
    }
  }
)
