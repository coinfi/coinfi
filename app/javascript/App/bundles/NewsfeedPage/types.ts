import { ItemWithCoinLinkData, CoinSlug } from '../common/types'

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
  votes: VoteSummary
}

export interface NewsItemDict {
  [id: number]: NewsItem
}

export interface VoteSummary {
  id: number
  count: number
  total: number
  up: number
  down: number
}

export interface VoteSummaryDict {
  [newsId: number]: VoteSummary
}

export type ContentType = 'none' | 'coin' | 'news'

export interface Filters {
  coinSlugs: CoinSlug[]
  publishedSince?: string | null
  publishedUntil?: string | null
  categories: string[]
  feedSources: string[]
}
