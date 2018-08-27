import * as React from 'react'
import { NewsItem, Filters } from '../bundles/NewsfeedPage/types';

export interface NewsfeedContextType {
  status: string,
  newslist: Array<NewsItem>,
  isLoading: boolean,
  isLoadingMoreItems: boolean,
  isReady: boolean,
  fetchNewNewsItems: (filters: Filters) => Promise<NewsItem[]>,
  fetchNewsItems: (filters: Filters) => Promise<NewsItem[]>, 
  fetchMoreNewsItems: (filters: Filters) => Promise<NewsItem[]>,
}

const NewsfeedContext = React.createContext(null)

export default NewsfeedContext
