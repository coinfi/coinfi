import { namespace } from './constants'
import { selectIDs, selectEntities } from '../../lib/redux/createSelectors'

export const coinIDs = selectIDs(namespace, 'coins')
export const coins = selectEntities(namespace, 'coins')
export const articles = selectEntities(namespace, 'articles')
export const tags = selectEntities(namespace, 'articles', 'tags')
