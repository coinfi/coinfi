import * as React from 'react'
import { INewsItem, IFilters } from '../bundles/NewsfeedPage/types'

export interface NewsfeedContextType {
  status: string,
  newslist: INewsItem[],
  isLoading: boolean,
  isLoadingMoreItems: boolean,
  isReady: boolean,
  fetchNewNewsItems: (filters: IFilters) => Promise<INewsItem[]>,
  fetchNewsItems: (filters: IFilters) => Promise<INewsItem[]>, 
  fetchMoreNewsItems: (filters: IFilters) => Promise<INewsItem[]>,
  cleanNewsItems: () => void,
}

const NewsfeedContext = React.createContext(null)

export default NewsfeedContext
