import { normalize, schema } from 'normalizr'
const tagSchema = new schema.Entity('tags')
const tagListSchema = [tagSchema]
const articleSchema = new schema.Entity('articles', { tags: tagListSchema })
const articleListSchema = [articleSchema]

export default (response) => normalize(response, articleListSchema)
