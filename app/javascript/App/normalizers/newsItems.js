import { normalize, schema } from 'normalizr'
const tagSchema = new schema.Entity('tags')
const tagListSchema = [tagSchema]
const newsItemSchema = new schema.Entity('newsItems', { tags: tagListSchema })
const newsItemListSchema = [newsItemSchema]

export default (response) => normalize(response, newsItemListSchema)
