export const fetchCoin = id => {
  return { type: 'FETCH_COIN', id }
}

export const fetchCoinSuccess = response => {
  return { type: 'FETCH_COIN_SUCCESS', response }
}
