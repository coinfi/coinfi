import * as React from 'react'
import { NewsItem } from '../bundles/NewsfeedPage/types';

export interface NewsfeedContextType {
  status: string,
  newslist: Array<NewsItem>,
  isLoading: boolean,
  isLoadingMoreItems: boolean,
  isReady: boolean,
  fetchNewsItemsForCoin: (coinSlug: string) => void,
  fetchMoreNewsItems: () => void,
  fetchAllNewsItems: () => void, 
}

const NewsfeedContext = React.createContext(null)

export default NewsfeedContext
