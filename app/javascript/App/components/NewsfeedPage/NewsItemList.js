import React, { Fragment } from 'react'
import NewsItemListItem from './NewsItemListItem'
import LoadingIndicator from '../LoadingIndicator'

const NewsItemList = (props) => {
  const { newsItems, isLoading } = props
  return (
    <Fragment>
      {isLoading('newsItems') && (
        <LoadingIndicator className="overlay bg-white-70" />
      )}
      <div className="flex-auto overflow-y-auto">
        {newsItems.map((newsItem) => (
          <NewsItemListItem
            key={newsItem.get('id')}
            {...props}
            newsItem={newsItem}
          />
        ))}
      </div>
    </Fragment>
  )
}

export default NewsItemList
