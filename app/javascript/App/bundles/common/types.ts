export interface Coin {
  id: number
  market_info: any
  name: string
  slug: string
  symbol: string
}

export type CoinList = Array<Coin>

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

export interface WindowScreenType extends Window {
  isMobile?: boolean
  isTablet?: boolean
}

export interface CoinWithDetails extends Coin {
  image_url: string
  price_usd: any
  prices_data: any
  news_data: any
  is_being_watched: any
}
