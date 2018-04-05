export const fetchCoins = () => {
  return { type: 'FETCH_COINS' }
}

export const fetchCoinsSuccess = response => {
  return { type: 'FETCH_COINS_SUCCESS', response }
}

export const fetchArticles = () => {
  return { type: 'FETCH_ARTICLES' }
}

export const fetchArticlesSuccess = response => {
  return { type: 'FETCH_ARTICLES_SUCCESS', response }
}

export const selectCategory = category => {
  return { type: 'SELECT_CATEGORY', category }
}

export const filterCoins = filterText => {
  return { type: 'FILTER_COINS', filterText }
}

export const searchCoins = searchText => {
  return { type: 'SEARCH_COINS', searchText }
}

export const searchCoinsSuccess = response => {
  return { type: 'SEARCH_COINS_SUCCESS', response }
}

export const removeCoin = id => {
  return { type: 'REMOVE_COIN', id }
}

export const removeCoinSuccess = response => {
  return { type: 'REMOVE_COIN_SUCCESS', response }
}

export const addCoinSuccess = () => {
  return { type: 'ADD_COIN_SUCCESS' }
}

export const editWatchlist = () => {
  return { type: 'EDIT_WATCHLIST' }
}
