import { IItemWithCoinLinkData } from '../common/types'

interface ICategory {
  name: string
}

export interface INewsItem extends IItemWithCoinLinkData {
  id: number
  title: string
  summary: string
  content: string
  url: string
  feed_item_published_at: string
  categories: ICategory[]
}

export type ContentType = 'none' | 'coin' | 'news'

type CoinSlug = string

export interface IFilters {
  coinSlugs: CoinSlug[]
  publishedSince: string | null
  publishedUntil: string | null
  categories: string[]
  feedSources: string[]
}
