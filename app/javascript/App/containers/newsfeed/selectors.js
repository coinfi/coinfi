import { namespace } from './constants'
import {
  selectIDs,
  selectEntities,
  selectEntityFromList,
  selectEntityChildren,
  selectEntityDetails
} from '../../lib/redux/createEntitySelectors'

export const coinIDs = selectIDs(namespace, 'coins')
export const coins = selectEntities(namespace, 'coins')
export const articles = selectEntities(namespace, 'articles')
export const tags = selectEntities(namespace, 'tags')
export const selectArticleFromList = selectEntityFromList(namespace, 'articles')
export const selectCoinDetails = selectEntityDetails(namespace, 'coins')
export const selectArticleTags = selectEntityChildren(
  namespace,
  'articles',
  'tags'
)
