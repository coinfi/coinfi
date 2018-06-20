import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import NewsListItemAnimated from './NewsListItemAnimated'
import LoadingIndicator from '../LoadingIndicator'

class NewsList extends Component {
  state = { initialRender: true }

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
    }, 6000)

    this.mountOnScrollHandler()
  }

  componentDidUpdate() {
    const timer = setInterval(() => {
      if (!window.isMobile && !window.isTablet) {
        const $newsfeed = $('#newsfeed')
        if ($newsfeed.height() < $newsfeed.find('> div').get(0).clientHeight) {
          clearInterval(timer)
        } else {
          this.props.fetchMoreNewsFeed()
        }
      } else {
        clearInterval(timer)
      }
    }, 1000)
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
    setActiveEntity({ type: 'newsItem', id: newsItem.get('id') })
    if (window.isMobile) enableUI('bodySectionDrawer', { fullScreen: true })
  }

  render() {
    const { isLoading, sortedNewsItems } = this.props
    const itemHeight = this.state.initialRender ? 'auto' : 0

    return (
      <Fragment>
        {isLoading('newsItems') && (
          <LoadingIndicator className="overlay bg-white-70" />
        )}
        <div
          id="newsfeed"
          className="flex-auto relative overflow-y-hidden overflow-y-auto-m"
        >
          <div>
            {!sortedNewsItems.length && (
              <div className="pa3 tc mt4">
                <div className="pointer">
                  <h4 className="fw6 mv3 f4">No results found</h4>
                </div>
                <div className="flex justify-between flex-wrap">
                  <div className="f6 silver center">
                    <span className="ph2">
                      Try changing your search query or removing some filters
                    </span>
                  </div>
                </div>
              </div>
            )}
            {sortedNewsItems.map((newsItem) => (
              <NewsListItemAnimated
                key={newsItem.get('id')}
                {...this.props}
                newsItem={newsItem}
                height={itemHeight}
                setActiveNewsItem={this.setActiveNewsItem}
              />
            ))}
          </div>
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
