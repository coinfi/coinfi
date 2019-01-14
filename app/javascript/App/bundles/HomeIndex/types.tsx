export interface CoinData {
  id: number
  name: string
  symbol: string
  slug: string
  coin_key: string
  ranking: number
  image_url: string
  price: any
  market_cap: any
  change1h: string
  change24h: string
  change7d: string
  volume24h: any
  sparkline: string
}

export interface EnhancedCoinData extends CoinData {
  isWatched: boolean
}
