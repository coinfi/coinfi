import * as React from 'react'
import {
  NewsItem,
  NewsItemDictionary,
  Filters,
  VoteData,
  VoteDictionary,
} from './types'
import { CancelTokenSource } from 'axios'

export interface NewsfeedContextType
  extends PromiseCancellationInterface,
    BasicNewsInterface {
  status: string
  newslist: NewsItem[]
  newsItemDetails: NewsItemDictionary
  voteSummaries: VoteDictionary
  isLoading: boolean
  isLoadingMoreItems: boolean
  isReady: boolean
  fetchNewsItem: (newsItemId: number, cancelToken?) => Promise<NewsItem>
  fetchVotesforNewsItem: (newsItemId: number, cancelToken?) => Promise<VoteData>
  voteOnNewsItem: (
    newsItemId: number,
    direction: boolean,
    cancelToken?,
  ) => Promise<VoteData>
  hasMore: boolean
}

export interface BasicNewsInterface {
  fetchNewsItems: (filters: Filters, cancelToken?) => Promise<NewsItem[]>
  fetchMoreNewsItems: (filters: Filters, cancelToken?) => Promise<NewsItem[]>
  fetchNewNewsItems: (filters: Filters, cancelToken?) => Promise<NewsItem[]>
  cleanNewsItems: () => void
}

export interface PromiseCancellationInterface {
  getCancelFetchSource: () => CancelTokenSource
}

const NewsfeedContext = React.createContext<NewsfeedContextType>(null)

export const withNewsfeed = (WrappedComponent) => (props) => (
  <NewsfeedContext.Consumer>
    {(payload) => <WrappedComponent {...payload} {...props} />}
  </NewsfeedContext.Consumer>
)

export default NewsfeedContext
