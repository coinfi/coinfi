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
  UserVoteItem,
} from './types'

const STATUSES = {
  INITIALIZING: 'INITIALIZING',
  LOADING: 'LOADING',
  LOADING_MORE_ITEMS: 'LOADING_MORE_ITEMS',
  NEW_NEWS_ITEMS_LOADING: 'NEW_NEWS_ITEMS_LOADING',
  READY: 'READY',
}

interface Props {
  initialNewsItems?: NewsItem[]
  initialNewsItem?: NewsItem
  initialVotes?: UserVoteItem[]
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

    let initialVoteSummaries = {}
    if (initialSortedNewsItems) {
      initialVoteSummaries = initialSortedNewsItems.reduce(
        this.getVotesFromNewsItems,
        initialVoteSummaries,
      )
    }
    if (props.initialNewsItem) {
      initialVoteSummaries = this.getVotesFromNewsItems(
        initialVoteSummaries,
        props.initialNewsItem,
      )
    }
    if (props.initialVotes) {
      initialVoteSummaries = props.initialVotes.reduce(
        this.getVotesFromUserVotes,
        initialVoteSummaries,
      )
    }

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

  public getCancelFetchSource = () => {
    return localAPI.source()
  }

  public fetchNewNewsItems = (
    filters: Filters,
    cancelToken?,
  ): Promise<NewsItem[]> => {
    if (this.state.sortedNewsItems.length === 0) {
      return Promise.resolve([])
    }

    const firstNewsItem = this.state.sortedNewsItems[0]
    this.setState({
      status: STATUSES.NEW_NEWS_ITEMS_LOADING,
    })
    return localAPI
      .get(
        '/news',
        {
          ...filters,
          publishedSince: !!filters.publishedSince
            ? filters.publishedSince
            : firstNewsItem.feed_item_published_at,
        },
        cancelToken,
      )
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
            (newsItem: NewsItem) => !existingNewsIds.includes(newsItem.id),
          )
          .sort(this.sortNewsFunc)
        const voteSummaries = newNews.reduce(
          this.getVotesFromNewsItems,
          this.state.voteSummaries,
        )
        this.setState({
          sortedNewsItems: this.uniqNews([
            ...newNews,
            ...this.state.sortedNewsItems,
          ]),
          voteSummaries,
          status: STATUSES.READY,
        })
        return newNews
      })
  }

  public fetchNewsItems = (
    filters: Filters,
    cancelToken?,
  ): Promise<NewsItem[]> => {
    this.setState({
      status: STATUSES.LOADING,
      hasMore: true,
    })
    return localAPI
      .get('/news', { ...filters }, cancelToken)
      .then((response) => {
        const sortedNewsItems = this.uniqNews(
          response.payload.sort(this.sortNewsFunc),
        )
        const voteSummaries = sortedNewsItems.reduce(
          this.getVotesFromNewsItems,
          {},
        )
        this.setState({
          sortedNewsItems,
          voteSummaries,
          status: STATUSES.READY,
          hasMore: sortedNewsItems.length > 0,
        })
        return sortedNewsItems
      })
  }

  public fetchMoreNewsItems = (
    filters: Filters,
    cancelToken?,
  ): Promise<NewsItem[]> => {
    if (this.state.sortedNewsItems.length === 0) {
      return Promise.resolve([])
    }

    const lastNews = this.state.sortedNewsItems[
      this.state.sortedNewsItems.length - 1
    ]

    this.setState({
      status: STATUSES.LOADING_MORE_ITEMS,
    })
    return localAPI
      .get(
        `/news`,
        {
          ...filters,
          publishedUntil: !!filters.publishedUntil
            ? filters.publishedUntil
            : lastNews.feed_item_published_at,
        },
        cancelToken,
      )
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
        this.setState({
          sortedNewsItems: this.uniqNews([
            ...this.state.sortedNewsItems,
            ...moreNewsItems,
          ]),
          voteSummaries,
          status: STATUSES.READY,
          hasMore: moreNewsItems.length > 0,
        })
        return moreNewsItems
      })
  }

  public fetchNewsItem = (
    newsItemId: number,
    cancelToken?,
  ): Promise<NewsItem> => {
    const { sortedNewsItems, newsItemDetails } = this.state
    // sorted news can be used because both index/show news serializers are the same right now
    const existingNewsItem =
      _.find(sortedNewsItems, (item) => item.id === newsItemId) ||
      _.get(newsItemDetails, newsItemId)

    if (!_.isUndefined(existingNewsItem)) {
      return Promise.resolve(existingNewsItem)
    }

    return localAPI
      .get(`/news/${newsItemId}`, undefined, cancelToken)
      .then((response) => {
        const newsItem = response.payload
        const voteSummaries = this.getVotesFromNewsItems(
          this.state.voteSummaries,
          newsItem,
        )
        this.setState({
          status: STATUSES.READY,
          newsItemDetails: {
            ...this.state.newsItemDetails,
            [newsItem.id]: newsItem,
          },
          voteSummaries,
        })
        return newsItem
      })
  }

  public getVotesFromNewsItems = (
    votesDict: VoteDictionary,
    newsItem: NewsItem,
  ): VoteDictionary => {
    const { vote_score, user_vote, id } = newsItem
    const newVoteData = {
      vote_score,
      ...(!_.isUndefined(user_vote) && { user_vote }),
    }
    return {
      ...votesDict,
      [id]: {
        ...votesDict[id],
        ...newVoteData,
      },
    }
  }

  public getVotesFromUserVotes = (
    votesDict: VoteDictionary,
    userVoteItem: UserVoteItem,
  ): VoteDictionary => {
    const { user_vote, news_item_id } = userVoteItem
    const newVoteData = {
      user_vote,
    }
    return {
      ...votesDict,
      [news_item_id]: {
        ...votesDict[news_item_id],
        ...newVoteData,
      },
    }
  }

  public fetchVotesforNewsItem = (
    newsItemId: number,
    cancelToken?,
  ): Promise<VoteData> => {
    const { voteSummaries } = this.state
    const existingVotes = _.get(voteSummaries, newsItemId)
    if (!_.isUndefined(existingVotes)) {
      return Promise.resolve(existingVotes)
    }

    return localAPI
      .get(`/news/${newsItemId}/vote`, undefined, cancelToken)
      .then((response) => {
        const votes = response.payload

        this.setState({
          voteSummaries: {
            ...voteSummaries,
            [newsItemId]: votes,
          },
        })
        return votes
      })
  }

  public voteOnNewsItem = (
    newsItemId: number,
    direction: boolean,
    cancelToken?,
  ): Promise<VoteData> => {
    return localAPI
      .post(`/news/${newsItemId}/vote`, { direction }, cancelToken)
      .then((response) => {
        const votes = response.payload
        const { voteSummaries } = this.state
        this.setState({
          voteSummaries: {
            ...voteSummaries,
            [newsItemId]: votes,
          },
        })
        return votes
      })
  }

  public render = () => {
    const payload: NewsfeedContextType = {
      getCancelFetchSource: this.getCancelFetchSource,
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
