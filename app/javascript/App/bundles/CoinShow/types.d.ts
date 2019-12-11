interface CoinObj {
  id: number
  name: string
  coin_key: string
  symbol: string
  slug: string
  ranking: number
  ico_status: string
  website: string
  whitepaper: string
  explorer: string
  twitter: string
  reddit: string
  medium: string
  github: string
  telegram: string
  release_date: string
  blockchain_tech: string
  algorithm: string
  ico_start_epoch: number
  ico_end_epoch: number
  updated_at: string
  team: TeamMember[]
  description: string
  ico_start_date: string
  ico_end_date: string
  ico_usd_raised: number
  ico_token_price_usd: number
  ico_tokens_sold: number
  prices_data: PriceData[]
  news_data: NewsData[]
  market_info: MarketInfo
  is_being_watched: boolean
  summary: string
  price: number
  market_cap: number
  change1h: number
  change24h: number
  change7d: number
  volume24h: number
  available_supply: number
  max_supply: number
  total_supply: number
  fixed_supply: number
  image_url: string
  market_pairs: MarketData[]
  total_market_pairs: number
}

interface PriceData {
  close: number
  coin_key: string
  high: number
  low: number
  open: number
  time: string
  to_currency: string
  volume_from: number
  volume_to: number
}

interface NewsData {
  text: string
  title: number // id
  url: string
  x: number // ms since epoch
}

interface MarketInfo {
  '24_volume_usd': string
  available_supply: string
  change1h: number
  change7d: number
  change24h: number
  last_retrieved: string
  market_cap: number
  market_cap_usd: string
  max_supply: number
  price: number
  price_usd: number
  total_supply: string
  volume24h: number
}

interface MarketData {
  exchange_id: number
  exchange_name: string
  exchange_slug: string
  pair: string
  price: number
  volume24h: number
  volume_percentage: number
  volume24h_quote: number
  quote_currency_symbol: string
  last_updated: string
}

interface TeamMember {
  name: string
  title?: string
  linkedin?: string
  icobench_profile?: string
}

type TokenMetrics = { [Data in TokenDataType]: TokenData[] } &
  { [MetaData in TokenMetaDataType]: TokenMetaData }

interface TokenMetaData {
  rank: number
  num_coins: number
  metric_value: number
}

interface TokenData {
  date: string
  percentage?: number
  number?: number
}

declare enum TokenDataType {
  'exchange_supply_data' = 'exchange_supply_data',
  'token_retention_rate_data' = 'token_retention_rate_data',
  'token_distribution_100_data' = 'token_distribution_100_data',
  'unique_wallet_count_data' = 'unique_wallet_count_data',
  'token_velocity_data' = 'token_velocity_data',
}
declare enum TokenMetaDataType {
  'exchange_supply_metadata' = 'exchange_supply_metadata',
  'token_retention_rate_metadata' = 'token_retention_rate_metadata',
  'token_distribution_100_metadata' = 'token_distribution_100_metadata',
  'unique_wallet_count_metadata' = 'unique_wallet_count_metadata',
  'token_velocity_metadata' = 'token_velocity_metadata',
}
