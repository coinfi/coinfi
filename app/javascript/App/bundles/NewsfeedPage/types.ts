import { ItemWithCoinLinkData, CoinSlug } from '../common/types'

interface Category {
  name: string
}

export interface NewsItem extends ItemWithCoinLinkData, VoteData {
  id: number
  title: string
  summary: string
  content: string
  url: string
  feed_item_published_at: string
  categories: Category[]
}

export interface NewsItemDictionary {
  [id: number]: NewsItem
}

export interface VoteData {
  user_vote?: boolean
  vote_score: number
}

export interface UserVoteItem {
  news_item_id: number
  user_vote: boolean
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
  trending: boolean
}
