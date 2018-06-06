export const listIndex = (list, value, key = 'key') => {
  let index = list.size
  const existingIndex = list.findIndex((o) => o.get(key) === value)
  if (existingIndex >= 0) index = existingIndex
  return index
}

export const buildFilterObject = (activeFilters) => {
  if (!activeFilters || activeFilters.size === 0) return {}
  return activeFilters.toJS().reduce((n, o) => {
    n[o.key] = o.value
    return n
  }, {})
}
