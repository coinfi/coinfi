export const fetchNewsfeed = () => {
  return { type: 'FETCH_NEWSFEED' }
}

export const fetchCoinsSuccess = (response) => {
  return { type: 'FETCH_NEWSFEED_COINS_SUCCESS', response }
}

export const fetchArticlesSuccess = (response) => {
  return { type: 'FETCH_NEWSFEED_ARTICLES_SUCCESS', response }
}
