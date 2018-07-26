import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import NewsListItem from './NewsListItem'
import LoadingIndicator from '../LoadingIndicator'
import Tips from './Tips'

class NewsList extends Component {
  state = { initialRender: true, initialRenderTips: false }

  constructor(props) {
    super(props)
    this.mountOnScrollHandler = this.mountOnScrollHandler.bind(this)
    this.unmountOnScrollHandler = this.unmountOnScrollHandler.bind(this)
    this.onScrollNewsFeedMobile = this.onScrollNewsFeedMobile.bind(this)
    this.onScrollNewsFeedDesktop = this.onScrollNewsFeedDesktop.bind(this)
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ initialRender: false })
    }, 60000)
    this.mountOnScrollHandler()
  }

  componentDidUpdate() {
    const timer = setInterval(() => {
      if (!window.isMobile && !window.isTablet) {
        this.props.fetchMoreNewsFeed()
      }
    }, 60000)
    clearInterval(timer)
  }

  componentWillUnmount() {
    this.unmountOnScrollHandler()
  }

  mountOnScrollHandler() {
    if (window.isMobile) {
      const throttled = _.throttle(this.onScrollNewsFeedMobile, 500)
      $(window).scroll(throttled)
    } else {
      const throttled = _.throttle(this.onScrollNewsFeedDesktop, 500)
      $('#newsfeed').scroll(throttled)
    }
  }

  unmountOnScrollHandler() {
    $(window).off('scroll', this.onScrollNewsFeedMobile)
    $('#newsfeed').off('scroll', this.onScrollNewsFeedDesktop)
  }

  onScrollNewsFeedMobile(e) {
    const $this = $(e.currentTarget)
    const bufferSpace = $this.height() / 3 + 300

    if (
      $this.scrollTop() + $this.height() + bufferSpace >=
      $(document).height()
    ) {
      this.props.fetchMoreNewsFeed()
    }
  }

  onScrollNewsFeedDesktop(e) {
    const $this = $(e.currentTarget)
    const bufferSpace = $this.height() / 3 + 400
    if (
      $this.scrollTop() + $this.innerHeight() + bufferSpace >=
      $this[0].scrollHeight
    ) {
      this.props.fetchMoreNewsFeed()
    }
  }

  setActiveNewsItem = (newsItem) => {
    const { setActiveEntity, enableUI } = this.props
    const url = newsItem.get('url')
    const urlFragments = url.split('/')
    const tweetId = urlFragments[urlFragments.length - 1]
    if (/twitter/.exec(url) !== null) {
      setActiveEntity({ type: 'twitterNews', id: newsItem.get('id'), tweetId })
    } else {
      setActiveEntity({ type: 'newsItem', id: newsItem.get('id') })
    }
    if (window.isMobile) {
      enableUI('bodySectionDrawer', { fullScreen: true })
    }
  }

  closeTips() {
    this.props.newsfeedTips()
  }

  renderView(viewState, initialRenderTips, isLoading) {
    if (initialRenderTips && window.isMobile) {
      return <Tips closeTips={this.closeTips.bind(this)} />
    } else if (isLoading('newsItems')) {
      return (
        <div className="pa3 tc mt4">
          <LoadingIndicator />
        </div>
      )
    } else if (!viewState.sortedNewsItems.length) {
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

    const mappedItems = viewState.sortedNewsItems.map((newsItem) => (
      <NewsListItem
        key={newsItem.get('id')}
        newsItem={newsItem}
        {...this.props}
        setActiveNewsItem={this.setActiveNewsItem}
        selectCoin={(symbol) => this.selectCoin(symbol)}
      />
    ))
    return mappedItems
  }

  selectCoin(coinData) {
    const { setFilter, clearSearch, setActiveEntity } = this.props
    if (this.selectedCoins) {
      let value = this.selectedCoins()
      value = union(value, [coinData.get('name')]) // eslint-disable-line no-undef
      setFilter({ key: 'coins', value })
      clearSearch()
    }
  }

  render() {
    const {
      newsItems,
      isLoading,
      activeEntity,
      activeFilters,
      sortedNewsItems,
      initialRenderTips,
    } = this.props
    const viewState = {
      activeEntity: activeEntity,
      newsItems: newsItems,
      sortedNewsItems: sortedNewsItems,
    }
    return (
      <Fragment>
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
          {this.renderView(viewState, initialRenderTips, isLoading)}
          <div>
            {!isLoading('newsItems') &&
              isLoading('newsfeed') && <LoadingIndicator />}
          </div>
        </div>
      </Fragment>
    )
  }
}

export default NewsList
