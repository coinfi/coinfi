import * as React from 'react'
import localAPI from '../../../lib/localAPI'
import normalizers from '../../../normalizers'
import NewsfeedContext, {
  NewsfeedContextType,
} from '../../../contexts/NewsfeedContext'
import { NewsItem, ContentType } from '../../NewsfeedPage/types'

const STATUSES = {
  INITIALIZING: 'INITIALIZING',
  LOADING: 'LOADING',
  LOADING_MORE_ITEMS: 'LOADING_MORE_ITEMS',
  READY: 'READY',
}

interface Props {
  coinSlug?: string
  newsItemId?: string
}

interface State {
  status: string
  sortedNewsItems: NewsItem[]
}

class NewsfeedContainer extends React.Component<Props, State> {
  public state = {
    sortedNewsItems: [],
    status: STATUSES.INITIALIZING,
  }

  public sortNewsFunc(x: NewsItem, y: NewsItem) {
    return (
      Date.parse(y.feed_item_published_at) -
      Date.parse(x.feed_item_published_at)
    )
  }

  public fetchAllNewsItems = () => {
    this.setState(
      {
        status: STATUSES.LOADING,
      },
      () => {
        localAPI.get('/news').then((response) => {
          this.setState({
            sortedNewsItems: response.payload.sort(this.sortNewsFunc),
            status: STATUSES.READY,
          })
        })
      },
    )
  }

  public fetchNewsItemsForCoin = (coinSlug) => {
    this.setState(
      {
        status: STATUSES.LOADING,
      },
      () => {
        localAPI.get(`/news?coinSlugs=${coinSlug}`).then((response) => {
          this.setState({
            sortedNewsItems: response.payload.sort(this.sortNewsFunc),
            status: STATUSES.READY,
          })
        })
      },
    )
  }

  public fetchMoreNewsItems = () => {
    const lastNews = this.state.sortedNewsItems[
      this.state.sortedNewsItems.length - 1
    ]
    this.setState(
      {
        status: STATUSES.LOADING_MORE_ITEMS,
      },
      () =>
        localAPI
          .get(`/news`, { publishedUntil: lastNews.publishedUntil })
          .then((response) => {
            this.setState({
              sortedNewsItems: [
                ...this.state.sortedNewsItems,
                ...response.payload.sort(this.sortNewsFunc),
              ],
              status: STATUSES.READY,
            })
          }),
    )
  }

  public render = () => {
    const payload: NewsfeedContextType = {
      fetchAllNewsItems: this.fetchAllNewsItems,
      fetchMoreNewsItems: this.fetchMoreNewsItems,
      fetchNewsItemsForCoin: this.fetchNewsItemsForCoin,
      isLoading: this.state.status === STATUSES.LOADING,
      isLoadingMoreItems: this.state.status === STATUSES.LOADING_MORE_ITEMS,
      isReady: this.state.status === STATUSES.READY,
      newslist: this.state.sortedNewsItems,
      status: this.state.status,
    }

    return (
      <NewsfeedContext.Provider value={payload}>
        {this.props.children}
      </NewsfeedContext.Provider>
    )
  }
}

export default NewsfeedContainer
