import * as React from 'react'
import NewsfeedPage from './NewsfeedPage'
import CoinListContext, {
  ICoinListContextType,
} from '../common/contexts/CoinListContext'
import NewsfeedContext, { INewsfeedContextType } from './NewsfeedContext'

interface IProps {
  loggedIn: boolean
  categories: string[]
  feedSources: string[]
  coinSlug?: string
  newsItemId?: string
}

const NewsfeedPageContainer = (props: IProps) => (
  <NewsfeedContext.Consumer>
    {(newsfeedPayload: INewsfeedContextType) => (
      <CoinListContext.Consumer>
        {(coinlistPayload: ICoinListContextType) => (
          <NewsfeedPage
            loggedIn={props.loggedIn}
            coinSlug={props.coinSlug}
            newsItemId={props.newsItemId}
            newslist={newsfeedPayload.newslist}
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
