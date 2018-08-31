import { IFilters } from './types'

const getDefaultFilters = (): IFilters => ({
  coinSlugs: [],
  publishedSince: null,
  publishedUntil: null,
  categories: [],
  feedSources: [],
})

export default getDefaultFilters 
