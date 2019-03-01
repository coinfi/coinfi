import * as React from 'react'
import {
  NewsItem,
  NewsItemDict,
  Filters,
  VoteSummary,
  VoteSummaryDict,
} from './types'

export interface NewsfeedContextType {
  status: string
  newslist: NewsItem[]
  newsItemDetails: NewsItemDict
  voteSummaries: VoteSummaryDict
  isLoading: boolean
  isLoadingMoreItems: boolean
  isReady: boolean
  fetchNewNewsItems: (filters: Filters) => Promise<NewsItem[]>
  fetchNewsItems: (filters: Filters) => Promise<NewsItem[]>
  fetchMoreNewsItems: (filters: Filters) => Promise<NewsItem[]>
  fetchNewsItem: (newsItemId: number) => Promise<NewsItem>
  fetchVotesforNewsItem: (newsItemId: number) => Promise<VoteSummary>
  voteOnNewsItem: (
    newsItemId: number,
    direction: string,
  ) => Promise<VoteSummary>
  cleanNewsItems: () => void
  hasMore: boolean
}

const NewsfeedContext = React.createContext<NewsfeedContextType>(null)

export const withNewsfeed = (WrappedComponent) => (props) => (
  <NewsfeedContext.Consumer>
    {(payload) => <WrappedComponent {...payload} {...props} />}
  </NewsfeedContext.Consumer>
)

export default NewsfeedContext
