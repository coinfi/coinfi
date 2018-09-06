import * as React from 'react'
import NewsfeedPage from './NewsfeedPage'
import CoinListContext, {
  ICoinListContextType,
} from '../../contexts/CoinListContext'
import NewsfeedContext, {
  INewsfeedContextType,
} from '../../contexts/NewsfeedContext'

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
            coinlist={coinlistPayload.coinlist}
            newslist={newsfeedPayload.newslist}
            isNewsfeedLoading={newsfeedPayload.isLoading}
            isNewsfeedLoadingMoreItems={newsfeedPayload.isLoadingMoreItems}
            isNewsfeedReady={newsfeedPayload.isReady}
            isCoinlistLoading={coinlistPayload.isLoading}
            isCoinlistReady={coinlistPayload.isReady}
            fetchNewsItems={newsfeedPayload.fetchNewsItems}
            fetchMoreNewsItems={newsfeedPayload.fetchMoreNewsItems}
            fetchNewNewsItems={newsfeedPayload.fetchNewNewsItems}
            cleanNewsItems={newsfeedPayload.cleanNewsItems}
            categories={props.categories}
            feedSources={props.feedSources}
          />
        )}
      </CoinListContext.Consumer>
    )}
  </NewsfeedContext.Consumer>
)

export default NewsfeedPageContainer
