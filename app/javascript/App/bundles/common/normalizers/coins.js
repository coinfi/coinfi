import { normalize, schema } from 'normalizr'
const coinSchema = new schema.Entity('coins')
const coinListSchema = [coinSchema]

export default (response) => normalize(response, coinListSchema)
