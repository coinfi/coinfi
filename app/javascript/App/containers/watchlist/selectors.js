import { namespace } from './constants'
import { createEntitySelectors } from '../../lib/redux'

const select = createEntitySelectors(namespace)

export const coinIDs = select.entityIDs('coins')
export const coins = select.entities('coins')
export const newsItems = select.entities('newsItems')
export const tags = select.entities('tags')
export const selectNewsItemTags = select.entityChildren('newsItems', 'tags')
