import React from 'react'
import NewsItemListItem from './NewsItemListItem'
import LoadingIndicator from '../LoadingIndicator'

const NewsItemList = (props) => {
  const { newsItems, isLoading } = props
  return (
    <div>
      {isLoading('newsItems') && <LoadingIndicator />}
      {newsItems.map((newsItem) => (
        <NewsItemListItem
          key={newsItem.get('id')}
          {...props}
          newsItem={newsItem}
        />
      ))}
    </div>
  )
}

export default NewsItemList
