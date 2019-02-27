export interface Coin {
  id: number
  market_info?: any
  name: string
  slug: string
  symbol: string
}

export type CoinSlug = string

export interface CoinLinkData {
  id: number
  symbol: string
  slug: string
}

export interface ItemWithCoinLinkData {
  coin_link_data: CoinLinkData[]
}

export type CoinList = Coin[]

export interface User {
  created_at: string
  email: string
  id: number
  provider: any
  role: string
  token_sale: any
  uid: string
  updated_at: string
  username: string
}

export interface CoinWithDetails extends Coin {
  image_url: string
  price: any
  prices_data: any[]
  // hourly_prices_data: any[]
  news_data: any
  is_being_watched: any
  related_coins_data: Array<Pick<Coin, 'id' | 'name' | 'slug' | 'symbol'>>
  summary: string
}

export interface FlashMessage {
  id: string
  type: string
  text: string
}

export type CoinClickHandler = (coinData: CoinLinkData) => void
