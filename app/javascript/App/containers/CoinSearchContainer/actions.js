export const searchCoins = (searchText, searchOpts) => {
  return { type: 'SEARCH_COINS', searchText, searchOpts }
}

export const searchCoinsSuccess = response => {
  return { type: 'SEARCH_COINS_SUCCESS', response }
}
