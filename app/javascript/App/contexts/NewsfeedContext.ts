import * as React from 'react'
import { INewsItem, IFilters } from '../bundles/NewsfeedPage/types'

export interface INewsfeedContextType {
  status: string
  newslist: INewsItem[]
  isLoading: boolean
  isLoadingMoreItems: boolean
  isReady: boolean
  fetchNewNewsItems: (
    filters: IFilters,
    searchKeyword: string,
  ) => Promise<INewsItem[]>
  fetchNewsItems: (
    filters: IFilters,
    searchKeyword: string,
  ) => Promise<INewsItem[]>
  fetchMoreNewsItems: (
    filters: IFilters,
    searchKeyword: string,
  ) => Promise<INewsItem[]>
  cleanNewsItems: () => void
}

const NewsfeedContext = React.createContext(null)

export default NewsfeedContext
