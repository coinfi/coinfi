export interface ICoin {
  id: number
  market_info: any
  name: string
  slug: string
  symbol: string
}

export interface ICoinLinkData {
  id: number
  symbol: string
  slug: string
}

export interface IItemWithCoinLinkData {
  coin_link_data: ICoinLinkData[]
}

export type CoinList = ICoin[]

export interface IUser {
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

export interface IWindowScreenType extends Window {
  isMobile?: boolean
  isTablet?: boolean
}

export interface ICoinWithDetails extends ICoin {
  image_url: string
  price_usd: any
  prices_data: any
  news_data: any
  is_being_watched: any
}

export interface FlashMessage {
  id: string
  type: string
  text: string
}
