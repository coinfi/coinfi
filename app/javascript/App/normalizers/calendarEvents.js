import { normalize, schema } from 'normalizr'
const categorySchema = new schema.Entity('categories')
const categoryListSchema = [categorySchema]
const calendarEventSchema = new schema.Entity('calendarEvents', {
  categories: categoryListSchema,
})
const calendarEventListSchema = [calendarEventSchema]

export default (response) => normalize(response, calendarEventListSchema)
