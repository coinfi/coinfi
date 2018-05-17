export const fetchWatchlist = () => {
  return { type: 'FETCH_WATCHLIST' }
}

export const fetchCoinsSuccess = (response) => {
  return { type: 'FETCH_COINS_SUCCESS', response }
}

export const fetchArticlesSuccess = (response) => {
  return { type: 'FETCH_ARTICLES_SUCCESS', response }
}

export const removeCoin = (id) => {
  return { type: 'REMOVE_COIN', id }
}

export const removeCoinSuccess = (response) => {
  return { type: 'REMOVE_COIN_SUCCESS', response }
}

export const addCoinSuccess = () => {
  return { type: 'ADD_COIN_SUCCESS' }
}

export const editWatchlist = () => {
  return { type: 'EDIT_WATCHLIST' }
}

export const reorderCoins = (order) => {
  return { type: 'REORDER_COINS', order }
}

export const reorderCoinsSuccess = () => {
  return { type: 'REORDER_COINS_SUCCESS' }
}
