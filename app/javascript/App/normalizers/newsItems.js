import {normalize, schema} from 'normalizr'
const categorySchema = new schema.Entity('categories')
const categoryListSchema = [categorySchema]
const newsItemSchema = new schema.Entity('newsItems', {
  categories: categoryListSchema,
})
const newsItemListSchema = [newsItemSchema]

export default response => normalize(response, newsItemListSchema)
