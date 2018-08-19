declare var window: {
  isMobile?: boolean,
  isTablet?: boolean,
};

import * as React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import _ from 'lodash'
import NewsListItem from './NewsListItem'
import LoadingIndicator from '../../components/LoadingIndicator'
import Tips from './Tips'
import scrollHelper from './../../scrollHelper'

import { NewsItem } from './types';

interface Props {
  isLoading: boolean,
  isInfiniteScrollLoading: boolean,
  activeFilters: any,
  sortedNewsItems: Array<NewsItem>,
  initialRenderTips: boolean,
  fetchMoreNewsFeed: () => void,
  closeTips: () => void,
};

interface State {
  initialRender: boolean,
  initialRenderTips: boolean,
};

class NewsList extends React.Component<Props, State> {
  state = { initialRender: true, initialRenderTips: false }

  componentDidMount() {
    // set max height to enable scroll in ff
    scrollHelper();
  }

  setActiveNewsItem = (newsItem) => {
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
      newsContent.style.maxHeight = `${colWrap.offsetHeight}px`
    }, 500)
  }

  renderView() {
    
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

    const mappedItems = this.props.sortedNewsItems.map((newsItem) => {
      const hasRead = readNewsIds.includes(newsItem.id)
      return (
        <NewsListItem
          key={newsItem.id}
          newsItem={newsItem}
          {...this.props}
          setActiveNewsItem={this.setActiveNewsItem}
          selectCoin={(symbol) => this.selectCoin(symbol)}
          hasRead={hasRead}
        />
      )
    })

    return (
      <InfiniteScroll
        dataLength={mappedItems.length}
        scrollableTarget={document.getElementById('newsfeed')}
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

  render() {
    const {
      activeEntity,
      activeFilters,
      initialRenderTips,
    } = this.props

    return (
      <div
        id="newsfeed"
        className="flex-auto relative overflow-y-hidden overflow-y-auto-m"
        style={
          !activeEntity &&
          window.isMobile &&
          !activeFilters.size &&
          initialRenderTips
            ? { marginTop: '-65px', background: '#fff', position: 'absolute' }
            : {}
        }
      >
        {this.renderView()}
      </div>
    )
  }
}

export default NewsList
