import * as React from 'react'
import { NewsItem, Filters } from './types'

export interface NewsfeedContextType {
  status: string
  newslist: NewsItem[]
  isLoading: boolean
  isLoadingMoreItems: boolean
  isReady: boolean
  fetchNewNewsItems: (filters: Filters) => Promise<NewsItem[]>
  fetchNewsItems: (filters: Filters) => Promise<NewsItem[]>
  fetchMoreNewsItems: (filters: Filters) => Promise<NewsItem[]>
  cleanNewsItems: () => void
  hasMore: boolean
}

const NewsfeedContext = React.createContext<NewsfeedContextType>(null)

export default NewsfeedContext
