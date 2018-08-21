import * as React from 'react'
import localAPI from '../../../lib/localAPI'
import normalizers from '../../../normalizers'
import NewsfeedContext, { NewsfeedContextType } from '../../../contexts/NewsfeedContext'
import { NewsItem, ContentType } from '../../NewsfeedPage/types';

const STATUSES = {
  INITIALIZING: 'INITIALIZING',
  LOADING: 'LOADING',
  LOADING_MORE_ITEMS: 'LOADING_MORE_ITEMS',
  READY: 'READY',
};

type Props = {
  coinSlug?: string,
  newsItemId?: string,
};

type State = {
  status: string,
  sortedNewsItems: Array<NewsItem>, 
};

class NewsfeedContainer extends React.Component<Props, State> {
  state = {
    status: STATUSES.INITIALIZING,
    sortedNewsItems: [],
  }

  sortNewsFunc(x: NewsItem, y: NewsItem) {
    return Date.parse(y.feed_item_published_at) - Date.parse(x.feed_item_published_at)
  }

  fetchAllNewsItems = () => {
    this.setState({
      status: STATUSES.LOADING,
    },() => {
      localAPI.get('/news').then((response) => {
        this.setState({
          status: STATUSES.READY,
          sortedNewsItems: response.payload.sort(this.sortNewsFunc),
        })
      })
    })
  }

  fetchNewsItemsForCoin = (coinSlug) => {
    this.setState({
      status: STATUSES.LOADING,
    }, () => {
      localAPI.get(`/news?coinSlugs=${coinSlug}`).then((response) => {
        this.setState({
          status: STATUSES.READY,
          sortedNewsItems: response.payload.sort(this.sortNewsFunc),
        })
      })
    })
  }

  fetchMoreNewsItems = () => {
    const lastNews = this.state.sortedNewsItems[this.state.sortedNewsItems.length - 1];
    this.setState({
        status: STATUSES.LOADING_MORE_ITEMS
      }, () => localAPI.get(`/news`, { publishedUntil: lastNews.publishedUntil }).then(response => {
          this.setState({
            status: STATUSES.READY,
            sortedNewsItems: [...this.state.sortedNewsItems, ...response.payload.sort(this.sortNewsFunc)]
          })
      })
    );
  }

  render = () => {

    const payload: NewsfeedContextType = {
      status: this.state.status,
      newslist: this.state.sortedNewsItems,
      isLoading: this.state.status === STATUSES.LOADING,
      isLoadingMoreItems: this.state.status === STATUSES.LOADING_MORE_ITEMS,
      isReady: this.state.status === STATUSES.READY,
      fetchNewsItemsForCoin: this.fetchNewsItemsForCoin,
      fetchMoreNewsItems: this.fetchMoreNewsItems,
      fetchAllNewsItems: this.fetchAllNewsItems,
   };

    return (
      <NewsfeedContext.Provider value={payload}>
        {this.props.children}
      </NewsfeedContext.Provider>
    )
  };
}

export default NewsfeedContainer
