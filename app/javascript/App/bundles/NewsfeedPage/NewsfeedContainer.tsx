import * as React from 'react'
import _ from 'lodash'
import localAPI from '../../lib/localAPI'
import NewsfeedContext, { NewsfeedContextType } from './NewsfeedContext'
import { NewsItem, Filters } from './types'

const STATUSES = {
  INITIALIZING: 'INITIALIZING',
  LOADING: 'LOADING',
  LOADING_MORE_ITEMS: 'LOADING_MORE_ITEMS',
  NEW_NEWS_ITEMS_LOADING: 'NEW_NEWS_ITEMS_LOADING',
  READY: 'READY',
}

interface State {
  sortedNewsItems: NewsItem[]
  status: string
  hasMore: boolean
}

class NewsfeedContainer extends React.Component<{}, State> {
  public state = {
    sortedNewsItems: [],
    status: STATUSES.INITIALIZING,
    hasMore: true,
  }

  public sortNewsFunc(x: NewsItem, y: NewsItem) {
    return (
      Date.parse(y.feed_item_published_at) -
      Date.parse(x.feed_item_published_at)
    )
  }

  public uniqNews = (arr) => {
    return _.uniqBy(arr, (elem) => elem.id)
  }

  public cleanNewsItems = () => {
    this.setState({
      sortedNewsItems: [],
    })
  }

  public fetchNewNewsItems = (filters: Filters): Promise<NewsItem[]> => {
    if (this.state.sortedNewsItems.length === 0) {
      return Promise.resolve([])
    }

    const firstNewsItem = this.state.sortedNewsItems[0]

    return new Promise((resolve, reject) => {
      this.setState(
        {
          status: STATUSES.NEW_NEWS_ITEMS_LOADING,
        },
        () => {
          localAPI
            .get('/news', {
              ...filters,
              publishedSince: !!filters.publishedSince
                ? filters.publishedSince
                : firstNewsItem.feed_item_published_at,
            })
            .then((response) => {
              if (!response.payload) {
                this.setState({
                  status: STATUSES.READY,
                })
                return Promise.resolve([])
              }
              const existingNewsIds = this.state.sortedNewsItems.map(
                (elem) => elem.id,
              )
              const newNews = response.payload
                .filter(
                  (newsItem: NewsItem) =>
                    !existingNewsIds.includes(newsItem.id),
                )
                .sort(this.sortNewsFunc)
              this.setState(
                {
                  sortedNewsItems: this.uniqNews([
                    ...newNews,
                    ...this.state.sortedNewsItems,
                  ]),
                  status: STATUSES.READY,
                },
                () => resolve(newNews),
              )
            })
        },
      )
    })
  }

  public fetchNewsItems = (filters: Filters): Promise<NewsItem[]> => {
    return new Promise((resolve, reject) => {
      this.setState(
        {
          status: STATUSES.LOADING,
          hasMore: true,
        },
        () => {
          localAPI.get('/news', { ...filters }).then((response) => {
            const sortedNewsItems = this.uniqNews(
              response.payload.sort(this.sortNewsFunc),
            )
            this.setState(
              {
                sortedNewsItems,
                status: STATUSES.READY,
                hasMore: sortedNewsItems.length > 0,
              },
              () => resolve(sortedNewsItems),
            )
          })
        },
      )
    })
  }

  public fetchMoreNewsItems = (filters: Filters): Promise<NewsItem[]> => {
    if (this.state.sortedNewsItems.length === 0) {
      return Promise.resolve([])
    }

    const lastNews = this.state.sortedNewsItems[
      this.state.sortedNewsItems.length - 1
    ]

    return new Promise((resolve, reject) => {
      this.setState(
        {
          status: STATUSES.LOADING_MORE_ITEMS,
        },
        () =>
          localAPI
            .get(`/news`, {
              ...filters,
              publishedUntil: !!filters.publishedUntil
                ? filters.publishedUntil
                : lastNews.feed_item_published_at,
            })
            .then((response) => {
              if (!response.payload) {
                this.setState({
                  status: STATUSES.READY,
                })
                return
              }
              const moreNewsItems = response.payload.sort(this.sortNewsFunc)
              this.setState(
                {
                  sortedNewsItems: this.uniqNews([
                    ...this.state.sortedNewsItems,
                    ...moreNewsItems,
                  ]),
                  status: STATUSES.READY,
                  hasMore: moreNewsItems.length > 0,
                },
                () => resolve(moreNewsItems),
              )
            }),
      )
    })
  }

  public render = () => {
    const payload: NewsfeedContextType = {
      cleanNewsItems: this.cleanNewsItems,
      fetchMoreNewsItems: this.fetchMoreNewsItems,
      fetchNewNewsItems: this.fetchNewNewsItems,
      fetchNewsItems: this.fetchNewsItems,
      isLoading: this.state.status === STATUSES.LOADING,
      isLoadingMoreItems: this.state.status === STATUSES.LOADING_MORE_ITEMS,
      isReady: this.state.status === STATUSES.READY,
      newslist: this.state.sortedNewsItems,
      status: this.state.status,
      hasMore: this.state.hasMore,
    }

    return (
      <NewsfeedContext.Provider value={payload}>
        {this.props.children}
      </NewsfeedContext.Provider>
    )
  }
}

export default NewsfeedContainer
