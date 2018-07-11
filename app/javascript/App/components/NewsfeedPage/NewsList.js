import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import NewsListItem from './NewsListItem'
import LoadingIndicator from '../LoadingIndicator'
import Tips from './Tips'
import { easeBackOut, easeBackInOut } from 'd3-ease'
import NodeGroup from 'react-move/NodeGroup'

class NewsList extends Component {
  state = {
    initialRender: true,
    initialRenderTips: false,
    latestNewsTime: null,
    open: false,
  }

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

    // set max height to enable scroll in ff
    const newsfeedElem = document.querySelector('#newsfeed')
    newsfeedElem.style.maxHeight = `${newsfeedElem.offsetHeight}px`
  }

  componentDidUpdate() {
    const timer = setInterval(() => {
      if (!window.isMobile && !window.isTablet) {
        // this.props.fetchMoreNewsFeed()
      }
    }, 60000)
    clearInterval(timer)
    // console.log(
    //   'set latest',
    //   this.props.sortedNewsItems[0] &&
    //     this.props.sortedNewsItems[0].get('updated_at'),
    // )

    if (
      this.props.sortedNewsItems[0] &&
      this.props.sortedNewsItems[0].get('updated_at') !==
        this.state.latestNewsTime
    ) {
      this.setState({
        latestNewsTime: this.props.sortedNewsItems[0].get('updated_at'),
      })
    }

    // console.log('update props', this.props)
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
    const tweetId = newsItem.get('url').split('/')[
      newsItem.get('url').split('/').length - 1
    ]
    if (/twitter/.exec(newsItem.get('url')) !== null) {
      setActiveEntity({ type: 'twitterNews', id: newsItem.get('id'), tweetId })
    } else {
      setActiveEntity({ type: 'newsItem', id: newsItem.get('id') })
    }
    if (window.isMobile) {
      enableUI('bodySectionDrawer', { fullScreen: true })
    }
    setTimeout(function() {
      const colWrap = document.querySelector('.column-wrap')
      const newsContent = document.querySelector('.selected-news-content')
      newsContent.style.maxHeight = `${colWrap.offsetHeight}px`
    }, 500)
  }

  closeTips() {
    this.props.newsfeedTips()
  }

  renderView(
    viewState,
    itemHeight,
    activeFilters,
    sortedNewsItems,
    initialRenderTips,
    isLoading,
  ) {
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
  }

  selectCoin(coinData) {
    const { setFilter, clearSearch, setActiveEntity } = this.props
    setActiveEntity({ type: 'coin', id: coinData.get('id') })
    let value = this.selectedCoins()
    value = union(value, [coinData.get('name')])
    setFilter({ key: 'coins', value })
    clearSearch()
  }

  render() {
    const itemHeight = this.state.initialRender ? 'auto' : 0
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
    const readNewsIds = JSON.parse(localStorage.getItem('readNews')) || []

    const newItems = viewState.sortedNewsItems.filter((item) => {
      return item.get('updated_at') === '2018-07-20T02:30:23.036Z'
      // return
      // ;('2018-07-19T23:30:10.275Z')
    })
    console.log('new items', newItems, sortedNewsItems)

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

          {/* {this.renderView( */}
          {/*   viewState, */}
          {/*   initialRenderTips, */}
          {/*   readNewsIds, */}
          {/*   isLoading, */}
          {/* )} */}

          {/* {this.renderView( */}
          {/*   viewState, */}
          {/*   itemHeight, */}
          {/*   activeFilters, */}
          {/*   sortedNewsItems, */}
          {/*   initialRenderTips, */}
          {/*   isLoading, */}
          {/* )} */}

          <NodeGroup
            data={newItems}
            keyAccessor={(d) => {
              return d.get('id')
            }}
            start={() => ({
              y: '-120px',
            })}
            enter={() => ({
              x: [this.state.open ? 200 : 100],
              timing: { duration: 750, ease: easeBackOut },
            })}
          >
            {(nodes) => {
              // console.log('nodes ', nodes)
              return (
                <div style={{ margin: 10, position: 'relative' }}>
                  {nodes.map(
                    ({ key, data, state: { x, opacity, backgroundColor } }) => {
                    // ({ key, data, state: { opacity, backgroundColor } }) => {
                      // debugger
                      return (
                        <div
                          style={{
                            backgroundColor: 'rgb(0, 207, 119)',
                            transition: 'all 500ms ease-in-out',
                            transform: `translateY(${x})`,
                          }}
                        >
                          <NewsListItem
                            key={key}
                            newsItem={data}
                            {...this.props}
                            setActiveNewsItem={this.setActiveNewsItem}
                            selectCoin={(symbol) => this.selectCoin(symbol)}
                            bgColor={backgroundColor}
                          />
                        </div>
                      )
                    },
                  )}
                </div>
              )
            }}
          </NodeGroup>

          <div style={{ margin: 10, position: 'relative' }}>
            {viewState.sortedNewsItems.map((data) => {
              // ({ key, state: { x, opacity, backgroundColor } }) => {
              // debugger
              // console.log('data ', data)
              return (
                <div>
                  <NewsListItem
                    key={data.get('id')}
                    newsItem={data}
                    {...this.props}
                    setActiveNewsItem={this.setActiveNewsItem}
                    selectCoin={(symbol) => this.selectCoin(symbol)}
                  />
                </div>
              )
            })}
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
