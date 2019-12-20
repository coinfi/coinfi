import * as React from 'react'
import NewsfeedPage from './NewsfeedPage'
import CoinListContext, {
  CoinListContextType,
} from '../common/contexts/CoinListContext'
import NewsfeedContext, { NewsfeedContextType } from './NewsfeedContext'
import { CoinWithDetails } from '~/bundles/common/types'
import { NewsItem } from '~/bundles/NewsfeedPage/types'
import { ThemeProvider, ThemeTypes } from '../common/contexts/ThemeContext'

interface Props {
  user: any
  loggedIn: boolean
  categories: string[]
  feedSources: string[]
  coinSlug?: string
  topCoinSlugs: string[]
  newsItemId?: string
  initialDrawer: boolean
  initialNewsItem?: NewsItem
  initialCoinWithDetails?: CoinWithDetails
  initialTheme?: ThemeTypes
}

const NewsfeedPageContainer = (props: Props) => (
  <ThemeProvider
    user={props.user}
    initialTheme={props.initialTheme}
    setCSSClass={true}
  >
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
              initialDrawer={props.initialDrawer}
              initialNewsItem={props.initialNewsItem}
              initialCoinWithDetails={props.initialCoinWithDetails}
              isNewsfeedLoading={newsfeedPayload.isLoading}
              getCancelFetchSource={newsfeedPayload.getCancelFetchSource}
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
  </ThemeProvider>
)

export default NewsfeedPageContainer
