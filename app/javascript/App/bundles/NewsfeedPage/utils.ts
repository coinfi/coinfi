import * as _ from 'lodash'
import { Filters } from './types'

export const SOCIAL_FEED_SOURCES = ['reddit', 'twitter']

export const getDefaultFilters = (): Filters => ({
  categories: [],
  coinSlugs: [],
  feedSources: [...SOCIAL_FEED_SOURCES],
  publishedSince: null,
  publishedUntil: null,
})

export const TOP_COINS = [
  'bitcoin',
  'ethereum',
  'ripple',
  'tron',
  'binance-coin',
]

export const isTopCoin = (coinSlug: string) => {
  return _.includes(TOP_COINS, coinSlug)
}

export const getInitialSocialSourcesForCoinsFilter = (
  coinSlugs: string[],
): Filters['feedSources'] => {
  // Enable social sources if there are low cap coins or if all coins are displayed
  if (!_.every(coinSlugs, isTopCoin) || _.isEmpty(coinSlugs)) {
    return SOCIAL_FEED_SOURCES
  }

  return []
}

export const mergeInitialSocialSourcesForCoinsFilter = (
  feedSources: Filters['feedSources'],
  coinSlugs: string[],
) => [
  ..._.without(feedSources, ...SOCIAL_FEED_SOURCES),
  ...getInitialSocialSourcesForCoinsFilter(coinSlugs),
]
