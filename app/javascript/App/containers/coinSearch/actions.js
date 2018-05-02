export const searchCoins = namespace => (searchText, searchOpts) => {
  return { type: 'SEARCH_COINS', searchText, searchOpts, namespace }
}

export const searchCoinsSuccess = namespace => response => {
  return { type: 'SEARCH_COINS_SUCCESS', response, namespace }
}

export const clearSearch = namespace => {
  return { type: 'CLEAR_SEARCH', namespace }
}
