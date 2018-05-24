import { namespace } from './constants'
import { createEntitySelectors } from '../../lib/redux'

const select = createEntitySelectors(namespace)

export const coinIDs = select.entityIDs('coins')
export const coins = select.entities('coins')
export const articles = select.entities('articles')
export const tags = select.entities('tags')
export const selectArticleTags = select.entityChildren('articles', 'tags')
