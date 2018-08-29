import * as React from 'react'
import _ from 'lodash';
import localAPI from '../../../lib/localAPI'
import NewsfeedContext, { NewsfeedContextType } from '../../../contexts/NewsfeedContext'
import { NewsItem } from '../../NewsfeedPage/types';

const STATUSES = {
  INITIALIZING: 'INITIALIZING',
  LOADING: 'LOADING',
  LOADING_MORE_ITEMS: 'LOADING_MORE_ITEMS',
  NEW_NEWS_ITEMS_LOADING: 'NEW_NEWS_ITEMS_LOADING',
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

  uniqNews = (arr) => {
    return _.uniqBy(arr, elem => elem.id);
  }

  fetchNewNewsItems = (): Promise<NewsItem[]> => {
    if (this.state.sortedNewsItems.length === 0) return Promise.resolve([]);

    const firstNewsItem = this.state.sortedNewsItems[0];

    return new Promise((resolve, _reject) => {
      this.setState({
        status: STATUSES.NEW_NEWS_ITEMS_LOADING
      }, () => {
        localAPI.get('/news', { publishedSince: firstNewsItem.feed_item_published_at }).then((response) => {
          if (!response.payload) {
            this.setState({
              status: STATUSES.READY,
            });
            return;
          }
          const existingNewsIds = this.state.sortedNewsItems.map(elem => elem.id);
          const newNews = response
                            .payload
                            .filter((newsItem: NewsItem) => !existingNewsIds.includes(newsItem.id))
                            .sort(this.sortNewsFunc);
          this.setState({
            status: STATUSES.READY,
            sortedNewsItems: this.uniqNews([...newNews, ...this.state.sortedNewsItems]),
          }, () => resolve(newNews));
        })
      })
    });
  }

  fetchAllNewsItems = (): Promise<NewsItem[]> => {
    return new Promise((resolve, _reject) => {
      this.setState({
        status: STATUSES.LOADING,
      },() => {
        localAPI.get('/news').then((response) => {
          const sortedNewsItems = this.uniqNews(response.payload.sort(this.sortNewsFunc));
          this.setState({
            status: STATUSES.READY,
            sortedNewsItems
          }, () => resolve(sortedNewsItems))
        })
      })
    })
  }

  fetchNewsItemsForCoin = (coinSlug): Promise<NewsItem[]> => {
    return new Promise((resolve, _reject) => {
      this.setState({
        status: STATUSES.LOADING,
      }, () => {
        localAPI.get(`/news?coinSlugs=${coinSlug}`).then((response) => {
          const sortedNewsItems = this.uniqNews(response.payload.sort(this.sortNewsFunc));
          this.setState({
            status: STATUSES.READY,
            sortedNewsItems
          }, () => resolve(sortedNewsItems));
        })
      })
    })
  }

  fetchMoreNewsItems = (): Promise<NewsItem[]> => {
    return new Promise((resolve, _reject) => {
      const lastNews = this.state.sortedNewsItems[this.state.sortedNewsItems.length - 1];
      this.setState({
          status: STATUSES.LOADING_MORE_ITEMS
        }, () => localAPI.get(`/news`, { publishedUntil: lastNews.feed_item_published_at }).then(response => {
            if (!response.payload) {
              this.setState({
                status: STATUSES.READY,
              });
              return;
            }
            const moreNewsItems = response.payload.sort(this.sortNewsFunc);
            this.setState({
              status: STATUSES.READY,
              sortedNewsItems: this.uniqNews([...this.state.sortedNewsItems, ...moreNewsItems]),
            }, () => resolve(moreNewsItems));
        })
      );
    })
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
      fetchNewNewsItems: this.fetchNewNewsItems,
   };

    return (
      <NewsfeedContext.Provider value={payload}>
        {this.props.children}
      </NewsfeedContext.Provider>
    )
  };
}

export default NewsfeedContainer
