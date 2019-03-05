import * as React from 'react'
import {
  NewsItem,
  NewsItemDictionary,
  Filters,
  VoteData,
  VoteDictionary,
} from './types'

export interface NewsfeedContextType {
  status: string
  newslist: NewsItem[]
  newsItemDetails: NewsItemDictionary
  voteSummaries: VoteDictionary
  isLoading: boolean
  isLoadingMoreItems: boolean
  isReady: boolean
  fetchNewNewsItems: (filters: Filters) => Promise<NewsItem[]>
  fetchNewsItems: (filters: Filters) => Promise<NewsItem[]>
  fetchMoreNewsItems: (filters: Filters) => Promise<NewsItem[]>
  fetchNewsItem: (newsItemId: number) => Promise<NewsItem>
  fetchVotesforNewsItem: (newsItemId: number) => Promise<VoteData>
  voteOnNewsItem: (newsItemId: number, direction: boolean) => Promise<VoteData>
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
