import * as React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import * as _ from 'lodash'
import NewsListItem from './NewsListItem'
import LoadingIndicator from '../../components/LoadingIndicator'
import Tips from './Tips'
import withDevice from '~/bundles/common/utils/withDevice'

import { NewsItem } from './types'
import { CoinLinkData } from '~/bundles/common/types'

interface Props {
  isShown: boolean
  isLoading: boolean
  sortedNewsItems: NewsItem[]
  initialRenderTips: boolean
  fetchMoreNewsFeed: () => void
  closeTips: () => void
  isWindowFocused: boolean
  selectedNewsItemId: string
  onNewsItemClick: (newsItem: NewsItem) => void
  onCoinClick: (coinData: CoinLinkData) => void
  hasMore: boolean
  isMobile: boolean
}

interface State {
  initialRender: boolean
  initialRenderTips: boolean
}

class NewsList extends React.Component<Props, State> {
  public state = { initialRender: true, initialRenderTips: false }

  private newsfeedDiv: React.RefObject<HTMLDivElement>

  constructor(props) {
    super(props)
    this.newsfeedDiv = React.createRef()
  }

  public onSelect = (newsItem) => {
    this.props.onNewsItemClick(newsItem)
  }

  public renderView() {
    if (this.props.initialRenderTips && this.props.isMobile) {
      return <Tips closeTips={this.props.closeTips} />
    } else if (this.props.isLoading) {
      return (
        <div className="pa3 tc mt4">
          <LoadingIndicator />
        </div>
      )
    } else if (!this.props.sortedNewsItems.length) {
      return (
        <div className="pa3 tc mt4">
          <div className="pointer">
            <h4 className="fw6 mv3 f4">No results found.</h4>
          </div>
          <div className="flex justify-between flex-wrap">
            <div className="f6 silver center">
              <span className="ph2">
                Try changing your search query or removing some filters.
              </span>
            </div>
          </div>
        </div>
      )
    }

    const hasLocalStorage = !_.isError(_.attempt(() => localStorage))
    const readNewsIds = hasLocalStorage
      ? JSON.parse(localStorage.getItem('readNews')) || []
      : []

    const mappedItems = this.props.sortedNewsItems.map((newsItem, index) => {
      const hasRead = readNewsIds.includes(newsItem.id)
      return (
        <NewsListItem
          key={newsItem.id}
          newsItem={newsItem}
          isSelected={this.props.selectedNewsItemId === newsItem.id.toString()}
          hasRead={hasRead}
          onClick={this.onSelect}
          onCoinClick={this.props.onCoinClick}
        />
      )
    })

    return (
      <InfiniteScroll
        dataLength={mappedItems.length}
        scrollableTarget="newsfeed"
        next={this.props.fetchMoreNewsFeed}
        hasMore={this.props.hasMore}
        loader={<LoadingIndicator />}
        endMessage={
          <p className="tc">
            <b>No more news present in the database.</b>
          </p>
        }
      >
        {mappedItems}
      </InfiniteScroll>
    )
  }

  public render() {
    if (!this.props.isShown) {
      return null
    }

    const { initialRenderTips } = this.props

    return (
      <div
        ref={this.newsfeedDiv}
        id="newsfeed"
        className="flex-auto relative overflow-y-scroll overflow-y-auto-m"
        style={
          this.props.isMobile && initialRenderTips
            ? {
                background: '#fff',
                overflow: 'hidden',
                position: 'absolute',
              }
            : {}
        }
      >
        {this.renderView()}
      </div>
    )
  }
}

export default withDevice(NewsList)
