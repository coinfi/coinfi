import React, { Component } from 'react'
import NewsItemListItem from './NewsItemListItem'

export default class NewsItemList extends Component {
  render() {
    const { newsItems } = this.props
    return (
      <div>
        {newsItems.map((newsItem) => (
          <NewsItemListItem
            key={newsItem.get('id')}
            {...this.props}
            newsItem={newsItem}
          />
        ))}
      </div>
    )
  }
}
