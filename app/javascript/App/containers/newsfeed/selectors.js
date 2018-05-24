import { namespace, filterList } from './constants'
import { createEntitySelectors, createFilterSelectors } from '../../lib/redux'

const select = createEntitySelectors(namespace)
const filterSelectors = createFilterSelectors(namespace, filterList)

export default {
  activeEntity: select.activeEntity,
  coinIDs: select.entityIDs('coins'),
  coins: select.entities('coins'),
  articles: select.entities('articles'),
  tags: select.entities('tags'),
  selectArticleFromList: select.entityFromList('articles'),
  selectCoinDetails: select.entityDetails('coin'),
  selectArticleTags: select.entityChildren('articles', 'tags'),
  ...filterSelectors
}
