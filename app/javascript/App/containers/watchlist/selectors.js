import {namespace} from './constants'
import {createEntitySelectors} from '../../lib/redux'

const select = createEntitySelectors(namespace)

export default {
  coinIDs: select.entityIDs('coins'),
  coins: select.entities('coins'),
  newsItems: select.entities('newsItems'),
  tags: select.entities('tags'),
  selectNewsCoins: select.entityChildren('newsItems', 'coins'),
}
