export const listIndex = (list, value, key = 'key') => {
  let index = list.size
  const existingIndex = list.findIndex((o) => o.get(key) === value)
  if (existingIndex >= 0) index = existingIndex
  return index
}
