import { Filters } from './types'

const getDefaultFilters = (): Filters => ({
  categories: [],
  coinSlugs: [],
  feedSources: [],
  publishedSince: null,
  publishedUntil: null,
})

export default getDefaultFilters
