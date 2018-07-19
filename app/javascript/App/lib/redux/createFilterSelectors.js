import {createSelector} from 'reselect'

export default (namespace, filterList) => {
  const selectState = state => state[namespace]
  return {
    activeFilters: createSelector(selectState, s => {
      return s.get('activeFilters')
    }),
    availableFilters: createSelector(selectState, s => {
      const active = s.get('activeFilters')
      return filterList.filter(item => {
        if (item.get('disabled') || item.get('unlisted')) return false
        return !active.find(o => o.get('key') === item.get('key'))
      })
    }),
    disabledFilters: createSelector(selectState, s => {
      return filterList.filter(item => {
        return !!item.get('disabled')
      })
    }),
  }
}
