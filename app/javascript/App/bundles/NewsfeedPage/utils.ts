import * as _ from 'lodash'
import { Filters } from './types'

export const SOCIAL_FEED_SOURCES = ['reddit', 'twitter']

export const getDefaultFilters = (): Filters => ({
  categories: [],
  coinSlugs: [],
  feedSources: [],
  trending: null,
})

export const getInitialSocialSourcesForCoinsFilter = (
  coinSlugs: string[],
  topCoinSlugs: string[],
): Filters['feedSources'] => {
  const isTopCoin = (coinSlug: string) => {
    return _.includes(topCoinSlugs, coinSlug)
  }

  // Disable social sources if there are only top coins or if all coins are displayed
  if (
    _.isEmpty(coinSlugs) ||
    coinSlugs.length > topCoinSlugs.length ||
    _.every(coinSlugs, isTopCoin)
  ) {
    return []
  }

  return SOCIAL_FEED_SOURCES
}

export const mergeInitialSocialSourcesForCoinsFilter = (
  feedSources: Filters['feedSources'],
  coinSlugs: string[],
  topCoinSlugs: string[],
) => [
  ..._.without(feedSources, ...SOCIAL_FEED_SOURCES),
  ...getInitialSocialSourcesForCoinsFilter(coinSlugs, topCoinSlugs),
]
