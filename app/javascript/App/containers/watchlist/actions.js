import { namespace } from './constants'
import { createEntityActions } from '../../lib/redux'
const entityActions = createEntityActions(namespace)

export default {
  ...entityActions,
  fetchCoins: () => {
      console.log('watchlist action fetchCoin')
    return { type: 'FETCH_COINS' }
  },
  removeCoin: (id) => {
    return { type: 'REMOVE_COIN', id }
  },
  removeCoinSuccess: (response) => {
    return { type: 'REMOVE_COIN_SUCCESS', response }
  },
  addCoinSuccess: () => {
    return { type: 'ADD_COIN_SUCCESS' }
  },
  reorderCoins: (payload) => {
    return { type: 'REORDER_COINS', payload }
  },
  reorderCoinsSuccess: () => {
    return { type: 'REORDER_COINS_SUCCESS' }
  }
}
