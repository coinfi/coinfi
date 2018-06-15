import React, { Component, Fragment } from 'react'
import NewsListItemAnimated from './NewsListItemAnimated'
import LoadingIndicator from '../LoadingIndicator'

class NewsList extends Component {
  state = { initialRender: true }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ initialRender: false })
    }, 6000)
  }
  setActiveNewsItem = (newsItem) => {
    const { setActiveEntity, enableUI } = this.props
    setActiveEntity({ type: 'newsItem', id: newsItem.get('id') })
    if (window.isMobile) enableUI('bodySectionDrawer', { fullScreen: true })
  }
  render() {
    const { newsItems, isLoading } = this.props
    const itemHeight = this.state.initialRender ? 'auto' : 0
    return (
      <Fragment>
        <div className="flex-auto overflow-y-auto relative">
          {isLoading('newsItems') && (
            <LoadingIndicator className="overlay bg-white-70" />
          )}
          {newsItems.map((newsItem) => (
            <NewsListItemAnimated
              key={newsItem.get('id')}
              {...this.props}
              newsItem={newsItem}
              height={itemHeight}
              setActiveNewsItem={this.setActiveNewsItem}
            />
          ))}
        </div>
      </Fragment>
    )
  }
}

export default NewsList
