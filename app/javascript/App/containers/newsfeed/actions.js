export const fetchCoins = () => {
  return { type: 'FETCH_NEWSFEED_COINS' }
}

export const fetchCoinsSuccess = response => {
  return { type: 'FETCH_NEWSFEED_COINS_SUCCESS', response }
}

export const fetchArticles = () => {
  return { type: 'FETCH_NEWSFEED_ARTICLES' }
}

export const fetchArticlesSuccess = response => {
  return { type: 'FETCH_NEWSFEED_ARTICLES_SUCCESS', response }
}
