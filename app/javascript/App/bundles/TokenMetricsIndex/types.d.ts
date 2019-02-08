interface CoinWithTokenData {
  id?: number
  coin_key: string
  name?: string
  image_url?: string
  symbol?: string
  slug?: string
  price?: number
  market_cap?: number
  rank: number
  metric_value: number
  change_1d: number
  change_7d: number
  change_30d: number
}

interface TokenMetricsResponsePayload {
  data: CoinWithTokenData[]
  page: number
  limit: number
  count: number
  metricType: string
  metricTypeSlug: string
  orderBy: string
  order: ORDERS
}

interface TokenMetricsTabData {
  slug: string
  label: string
  description: string
  columnName: string
  type: TAB_DATA_TYPES
}

type TAB_DATA_TYPES = 'percentage' | 'number'

type ORDERS = 'asc' | 'desc'
