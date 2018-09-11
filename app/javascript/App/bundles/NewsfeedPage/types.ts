import { ItemWithCoinLinkData } from '../common/types'

interface Category {
  name: string
}

export interface NewsItem extends ItemWithCoinLinkData {
  id: number
  title: string
  summary: string
  content: string
  url: string
  feed_item_published_at: string
  categories: Category[]
}

export type ContentType = 'none' | 'coin' | 'news'

export type CoinSlug = string

export interface Filters {
  coinSlugs: CoinSlug[]
  publishedSince: string | null
  publishedUntil: string | null
  categories: string[]
  feedSources: string[]
}
