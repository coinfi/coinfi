import { IFilters } from './types'

const getDefaultFilters = (): IFilters => ({
  categories: [],
  coinSlugs: [],
  feedSources: [],
  publishedSince: null,
  publishedUntil: null,
})

export default getDefaultFilters
