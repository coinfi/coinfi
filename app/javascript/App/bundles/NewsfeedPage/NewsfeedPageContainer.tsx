import * as React from 'react'
import NewsfeedPage from './NewsfeedPage'
import CoinListContext, {
  CoinListContextType,
} from '../common/contexts/CoinListContext'
import NewsfeedContext, { NewsfeedContextType } from './NewsfeedContext'
import { CoinWithDetails } from '~/bundles/common/types'
import { NewsItem } from '~/bundles/NewsfeedPage/types'

interface Props {
  loggedIn: boolean
  categories: string[]
  feedSources: string[]
  coinSlug?: string
  topCoinSlugs: string[]
  newsItemId?: string
  initialNewsItem?: NewsItem
  initialCoinWithDetails?: CoinWithDetails
}

const NewsfeedPageContainer = (props: Props) => (
  <NewsfeedContext.Consumer>
    {(newsfeedPayload: NewsfeedContextType) => (
      <CoinListContext.Consumer>
        {(coinlistPayload: CoinListContextType) => (
          <NewsfeedPage
            loggedIn={props.loggedIn}
            coinSlug={props.coinSlug}
            topCoinSlugs={props.topCoinSlugs}
            newsItemId={props.newsItemId}
            newslist={newsfeedPayload.newslist}
            initialNewsItem={props.initialNewsItem}
            initialCoinWithDetails={props.initialCoinWithDetails}
            isNewsfeedLoading={newsfeedPayload.isLoading}
            fetchNewsItems={newsfeedPayload.fetchNewsItems}
            fetchMoreNewsItems={newsfeedPayload.fetchMoreNewsItems}
            fetchNewNewsItems={newsfeedPayload.fetchNewNewsItems}
            cleanNewsItems={newsfeedPayload.cleanNewsItems}
            categories={props.categories}
            feedSources={props.feedSources}
            selectedCoinSlug={coinlistPayload.selectedCoinSlug}
            selectCoinBySlug={coinlistPayload.selectCoinBySlug}
            isWatchlistSelected={coinlistPayload.isWatchlist}
            getWatchlist={coinlistPayload.getWatchlist}
            watchlist={coinlistPayload.watchlist}
            hasMore={newsfeedPayload.hasMore}
          />
        )}
      </CoinListContext.Consumer>
    )}
  </NewsfeedContext.Consumer>
)

export default NewsfeedPageContainer
