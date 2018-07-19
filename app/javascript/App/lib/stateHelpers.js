export const listIndex = (list, value, key = 'key') => {
  let index = list.size
  const existingIndex = list.findIndex((o) => o.get(key) === value)
  if (existingIndex >= 0) index = existingIndex
  return index
}

export const buildFilterObject = (activeFilters) => {
  if (!activeFilters || activeFilters.size === 0) return {}
  return activeFilters.toJS().reduce((n, o) => {
    let { value } = o
    if (n.key === 'id') value = parseInt(o.value, 10)
    n[o.key] = value
    return n
  }, {})
}

export const normalizeFilterData = (filterData) => {
  const data = {}
  Object.entries(filterData).forEach(([key, values]) => {
    data[key] = values.map((value) => {
      let id, label
      if (value instanceof Object) {
        if (value.toJS) value = value.toJS()
        id = value.id
        label = value.label || value.title || value.name
      } else {
        id = value
        label = value
      }
      return { id, label }
    })
  })
  return data
}
