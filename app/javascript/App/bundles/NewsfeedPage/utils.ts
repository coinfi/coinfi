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
  // Disable social sources if there are only top coins or if all coins are displayed
  if (_.isEmpty(coinSlugs) || _.every(coinSlugs, isTopCoin)) {
    return []
  }

  return SOCIAL_FEED_SOURCES
}

export const mergeInitialSocialSourcesForCoinsFilter = (
  feedSources: Filters['feedSources'],
  coinSlugs: string[],
) => [
  ..._.without(feedSources, ...SOCIAL_FEED_SOURCES),
  ...getInitialSocialSourcesForCoinsFilter(coinSlugs),
]
