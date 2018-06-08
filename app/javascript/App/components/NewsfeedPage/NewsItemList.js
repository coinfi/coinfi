import React, { Component, Fragment } from 'react'
import NewsItemListItemAnimated from './NewsItemListItemAnimated'
import LoadingIndicator from '../LoadingIndicator'

class NewsItemList extends Component {
  state = { initialRender: true }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ initialRender: false })
    }, 6000)
  }
  render() {
    const { newsItems, isLoading } = this.props
    const itemHeight = this.state.initialRender ? 'auto' : 0
    return (
      <Fragment>
        {isLoading('newsItems') && (
          <LoadingIndicator className="overlay bg-white-70" />
        )}
        <div className="flex-auto overflow-y-auto relative">
          {newsItems.map((newsItem) => (
            <NewsItemListItemAnimated
              key={newsItem.get('id')}
              {...this.props}
              newsItem={newsItem}
              height={itemHeight}
            />
          ))}
        </div>
      </Fragment>
    )
  }
}

export default NewsItemList
