import { namespace } from './constants'
import {
  selectIDs,
  selectEntities,
  selectEntity,
  selectEntityChildren
} from '../../lib/redux/createEntitySelectors'

export const coinIDs = selectIDs(namespace, 'coins')
export const coins = selectEntities(namespace, 'coins')
export const articles = selectEntities(namespace, 'articles')
export const tags = selectEntities(namespace, 'tags')
export const selectArticle = selectEntity(namespace, 'articles')
export const selectArticleTags = selectEntityChildren(
  namespace,
  'articles',
  'tags'
)
