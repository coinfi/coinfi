import * as React from 'react'
import { INewsItem, IFilters } from './types'

export interface INewsfeedContextType {
  status: string
  newslist: INewsItem[]
  isLoading: boolean
  isLoadingMoreItems: boolean
  isReady: boolean
  fetchNewNewsItems: (filters: IFilters) => Promise<INewsItem[]>
  fetchNewsItems: (filters: IFilters) => Promise<INewsItem[]>
  fetchMoreNewsItems: (filters: IFilters) => Promise<INewsItem[]>
  cleanNewsItems: () => void
  hasMore: boolean
}

const NewsfeedContext = React.createContext(null)

export default NewsfeedContext
