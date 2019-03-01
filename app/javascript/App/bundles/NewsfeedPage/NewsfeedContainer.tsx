import * as React from 'react'
import * as _ from 'lodash'
import localAPI from '../common/utils/localAPI'
import NewsfeedContext, { NewsfeedContextType } from './NewsfeedContext'
import {
  NewsItem,
  NewsItemDictionary,
  Filters,
  VoteData,
  VoteDictionary,
} from './types'
import * as P from 'bluebird'

P.config({
  cancellation: true,
})

const STATUSES = {
  INITIALIZING: 'INITIALIZING',
  LOADING: 'LOADING',
  LOADING_MORE_ITEMS: 'LOADING_MORE_ITEMS',
  NEW_NEWS_ITEMS_LOADING: 'NEW_NEWS_ITEMS_LOADING',
  READY: 'READY',
}

interface Props {
  initialNewsItems?: any
}

interface State {
  sortedNewsItems: NewsItem[]
  status: string
  hasMore: boolean
  newsItemDetails: NewsItemDictionary
  voteSummaries: VoteDictionary
}

class NewsfeedContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const initialSortedNewsItems = props.initialNewsItems
      ? props.initialNewsItems.sort(this.sortNewsFunc)
      : undefined

    const initialVoteSummaries = initialSortedNewsItems
      ? initialSortedNewsItems.reduce(this.getVotesFromNewsItems, {})
      : {}

    // Set initial status
    const statusIsReady = !_.isUndefined(props.initialNewsItems)
    const initialStatus = statusIsReady ? STATUSES.READY : undefined

    this.state = {
      status: initialStatus || STATUSES.INITIALIZING,
      sortedNewsItems: initialSortedNewsItems || [],
      newsItemDetails: {},
      voteSummaries: initialVoteSummaries,
      hasMore: true,
    }
  }

  public sortNewsFunc(x: NewsItem, y: NewsItem) {
    return (
      Date.parse(y.feed_item_published_at) -
      Date.parse(x.feed_item_published_at)
    )
  }

  public uniqNews = (arr: NewsItem[]) => {
    return _.uniqBy<NewsItem>(arr, (elem) => elem.id)
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

    return new P((resolve, reject) => {
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
              const voteSummaries = newNews.reduce(
                this.getVotesFromNewsItems,
                this.state.voteSummaries,
              )
              this.setState(
                {
                  sortedNewsItems: this.uniqNews([
                    ...newNews,
                    ...this.state.sortedNewsItems,
                  ]),
                  voteSummaries,
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
    return new P((resolve, reject) => {
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
            const voteSummaries = sortedNewsItems.reduce(
              this.getVotesFromNewsItems,
              {},
            )
            this.setState(
              {
                sortedNewsItems,
                voteSummaries,
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

    return new P((resolve, reject) => {
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
              const voteSummaries = moreNewsItems.reduce(
                this.getVotesFromNewsItems,
                this.state.voteSummaries,
              )
              this.setState(
                {
                  sortedNewsItems: this.uniqNews([
                    ...this.state.sortedNewsItems,
                    ...moreNewsItems,
                  ]),
                  voteSummaries,
                  status: STATUSES.READY,
                  hasMore: moreNewsItems.length > 0,
                },
                () => resolve(moreNewsItems),
              )
            }),
      )
    })
  }

  public fetchNewsItem = (newsItemId: number): Promise<NewsItem> => {
    return new P((resolve, reject) => {
      const { sortedNewsItems, newsItemDetails } = this.state
      // sorted news can be used because both index/show news serializers are the same right now
      const existingNewsItem =
        _.find(sortedNewsItems, (item) => item.id === newsItemId) ||
        _.get(newsItemDetails, newsItemId)

      if (!_.isUndefined(existingNewsItem)) {
        return resolve(existingNewsItem)
      }

      localAPI.get(`/news/${newsItemId}`).then((response) => {
        const newsItem = response.payload
        const voteSummaries = this.getVotesFromNewsItems(
          this.state.voteSummaries,
          newsItem,
        )
        this.setState(
          {
            status: STATUSES.READY,
            newsItemDetails: {
              ...this.state.newsItemDetails,
              [newsItem.id]: newsItem,
            },
            voteSummaries,
          },
          () => resolve(newsItem),
        )
      })
    })
  }

  public getVotesFromNewsItems = (
    votesDict: VoteDictionary,
    newsItem: NewsItem,
  ): VoteDictionary => {
    const { votes, id } = newsItem
    return {
      ...votesDict,
      [id]: votes,
    }
  }

  public fetchVotesforNewsItem = (newsItemId: number): Promise<VoteData> => {
    return new P((resolve, reject) => {
      const { voteSummaries } = this.state
      const existingVotes = _.get(voteSummaries, newsItemId)
      if (!_.isUndefined(existingVotes)) {
        return resolve(existingVotes)
      }

      localAPI.get(`/news/${newsItemId}/vote`).then((response) => {
        const votes = response.payload

        this.setState(
          {
            voteSummaries: {
              ...voteSummaries,
              [newsItemId]: votes,
            },
          },
          () => resolve(votes),
        )
      })
    })
  }

  public voteOnNewsItem = (
    newsItemId: number,
    direction: string,
  ): Promise<VoteData> => {
    return new P((resolve, reject) => {
      localAPI
        .post(`/news/${newsItemId}/vote`, { direction })
        .then((response) => {
          const votes = response.payload
          const { voteSummaries } = this.state
          this.setState(
            {
              voteSummaries: {
                ...voteSummaries,
                [newsItemId]: votes,
              },
            },
            () => resolve(votes),
          )
        })
    })
  }

  public render = () => {
    const payload: NewsfeedContextType = {
      cleanNewsItems: this.cleanNewsItems,
      fetchMoreNewsItems: this.fetchMoreNewsItems,
      fetchNewNewsItems: this.fetchNewNewsItems,
      fetchNewsItems: this.fetchNewsItems,
      fetchNewsItem: this.fetchNewsItem,
      voteOnNewsItem: this.voteOnNewsItem,
      fetchVotesforNewsItem: this.fetchVotesforNewsItem,
      isLoading: this.state.status === STATUSES.LOADING,
      isLoadingMoreItems: this.state.status === STATUSES.LOADING_MORE_ITEMS,
      isReady: this.state.status === STATUSES.READY,
      newslist: this.state.sortedNewsItems,
      newsItemDetails: this.state.newsItemDetails,
      voteSummaries: this.state.voteSummaries,
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
