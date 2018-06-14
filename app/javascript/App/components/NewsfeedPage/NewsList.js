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
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ initialRender: false })
    }, 6000)

    this.mountOnScrollHandler()
  }

  componentDidUpdate() {
    if (!window.isMobile && !window.isTablet) {
      const $newsFeed = $('#news-feed')
      const timer = setInterval(() => {
        if ($newsFeed.height() < $newsFeed.find('> div').get(0).clientHeight) {
          clearInterval(timer)
        } else {
          this.props.scrollBottomToReducer(true)
        }
      }, 1000)
    }
  }

  componentWillUnmount() {
    this.unmountOnScrollHandler()
  }

  mountOnScrollHandler() {
    if (window.isMobile || window.isTablet) {
      const throttled = _.throttle(this.props.onScrollNewsFeedMobile, 1000)
      $(window).scroll(throttled)
    } else {
      const throttled = _.throttle(this.props.onScrollNewsFeedDesktop, 1000)
      $('#news-feed').scroll(throttled)
    }
  }

  unmountOnScrollHandler() {
    $(window).off('scroll', this.props.onScrollNewsFeedMobile)
    $('#news-feed').off('scroll', this.props.onScrollNewsFeedDesktop)
  }

  render() {
    const { isLoading } = this.props
    const isMobile = window.isMobile

    const itemHeight = this.state.initialRender ? 'auto' : 0
    return (
      <Fragment>
        {isLoading('newsItems') && (
          <LoadingIndicator className="overlay bg-white-70" />
        )}
        <div id="news-feed"
          className={'flex-auto relative overflow-y-' + (isMobile ? 'hidden' : 'auto')}>
          <div>
            {this.props.newsItems.map((newsItem) => (
              <NewsListItemAnimated
                key={newsItem.get('id')}
                {...this.props}
                newsItem={newsItem}
                height={itemHeight}
              />
            ))}
          </div>
          <div>
            {!isLoading('newsItems') && isLoading('newsFeed') && (
              <LoadingIndicator className="bg-white-70" />
            )}
          </div>
        </div>
      </Fragment>
    )
  }
}

export default NewsList
