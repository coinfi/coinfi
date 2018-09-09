/* tslint:disable */
declare var window: {
  isMobile?: boolean
  isTablet?: boolean
}

import * as React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import _ from 'lodash'
import NewsListItem from './NewsListItem'
import LoadingIndicator from '../../components/LoadingIndicator'
import Tips from './Tips'
import scrollHelper from './../../scrollHelper'

import { INewsItem } from './types'

interface IProps {
  // FIXME all props must be required
  isShown?: boolean
  isLoading?: boolean
  isInfiniteScrollLoading?: boolean
  activeFilters?: any
  sortedNewsItems?: INewsItem[]
  initialRenderTips?: boolean
  fetchMoreNewsFeed?: () => void
  closeTips?: () => void
  isNewsSeen?: (id) => boolean
  isWindowFocused?: boolean
  selectedNewsItemId?: string
  onNewsItemClick: any
}

interface IState {
  initialRender: boolean
  initialRenderTips: boolean
}

class NewsList extends React.Component<IProps, IState> {
  public state = { initialRender: true, initialRenderTips: false }

  private newsfeedDiv: React.RefObject<HTMLDivElement>

  constructor(props) {
    super(props)
    this.newsfeedDiv = React.createRef()
  }

  public componentDidMount() {
    // set max height to enable scroll in ff
    scrollHelper()
  }

  public componentDidUpdate() {
    scrollHelper()
  }

  public setActiveNewsItem = (newsItem) => {
    // @ts-ignore FIXME
    const { setActiveEntity, enableUI } = this.props
    const url = newsItem.url
    const urlFragments = url.split('/')
    const tweetId = urlFragments[urlFragments.length - 1]
    if (/twitter/.exec(url) !== null) {
      setActiveEntity({ type: 'twitterNews', id: newsItem.id, tweetId })
    } else {
      setActiveEntity({ type: 'newsItem', id: newsItem.id })
    }
    if (window.isMobile) {
      enableUI('bodySectionDrawer', { fullScreen: true })
    }
    setTimeout(() => {
      // set max height to enable scroll in ff
      const colWrap = document.querySelector('.column-wrap')
      const newsContent = document.querySelector('.selected-news-content')
      // @ts-ignore FIXME
      newsContent.style.maxHeight = `${colWrap.offsetHeight}px`
    }, 500)
  }

  public renderView() {
    if (this.props.initialRenderTips && window.isMobile) {
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

    const readNewsIds = JSON.parse(localStorage.getItem('readNews')) || []

    const mappedItems = this.props.sortedNewsItems.map((newsItem, index) => {
      const hasRead = readNewsIds.includes(newsItem.id)
      return (
        <NewsListItem
          key={newsItem.id}
          newsItem={newsItem}
          {...this.props}
          isSelected={this.props.selectedNewsItemId === newsItem.id.toString()}
          setActiveNewsItem={this.setActiveNewsItem}
          // @ts-ignore FIME
          selectCoin={(symbol) => this.selectCoin(symbol)}
          hasRead={hasRead}
          onClick={this.props.onNewsItemClick}
        />
      )
    })

    return (
      <InfiniteScroll
        dataLength={mappedItems.length}
        scrollableTarget="newsfeed"
        next={this.props.fetchMoreNewsFeed}
        hasMore={true} // TODO: Actually determine when there are no more NewsItems...
        loader={<LoadingIndicator />}
      >
        {mappedItems}
      </InfiniteScroll>
    )
  }

  // TODO: this commented out code will be uncommented and merged with existing functionality
  // selectCoin(coinData) {
  //   const { setFilter, clearSearch, setActiveEntity } = this.props
  //   setActiveEntity({ type: 'coin', id: coinData.get('id') })
  //   if (this.selectedCoins) {
  //     let value = this.selectedCoins()
  //     value = union(value, [coinData.get('name')]) // eslint-disable-line no-undef
  //     setFilter({ key: 'coins', value })
  //     clearSearch()
  //   }
  // }

  public render() {
    if (!this.props.isShown) return null

    const {
      // @ts-ignore FIXME
      activeEntity,
      activeFilters,
      initialRenderTips,
    } = this.props

    return (
      <div
        ref={this.newsfeedDiv}
        id="newsfeed"
        className="flex-auto relative overflow-y-scroll overflow-y-auto-m"
        style={
          window.isMobile && initialRenderTips
            ? {
                background: '#fff',
                marginTop: '-65px',
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

export default NewsList
