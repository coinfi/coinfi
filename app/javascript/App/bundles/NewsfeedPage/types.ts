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
  votes: VoteData
}

export interface NewsItemDictionary {
  [id: number]: NewsItem
}

export interface VoteData {
  vote?: string
  vote_summary: VoteSummary
}

export interface VoteSummary {
  id: number
  total: number
}

export interface VoteDictionary {
  [newsId: number]: VoteData
}

export type ContentType = 'none' | 'coin' | 'news'

export interface Filters {
  coinSlugs: CoinSlug[]
  publishedSince?: string | null
  publishedUntil?: string | null
  categories: string[]
  feedSources: string[]
}
