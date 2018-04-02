import { normalize, schema } from 'normalizr'
const coinSchema = new schema.Entity('coins')
const coinListSchema = [coinSchema]
const tagSchema = new schema.Entity('tags')
const tagListSchema = [tagSchema]
const articleSchema = new schema.Entity('articles', { tags: tagListSchema })
const articleListSchema = [articleSchema]

export default {
  coins: coins => normalize(coins, coinListSchema).entities,
  articles: articles => normalize(articles, articleListSchema).entities
}
