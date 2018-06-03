import React, { Fragment } from 'react'
import NewsItemListItemAnimated from './NewsItemListItemAnimated'
import LoadingIndicator from '../LoadingIndicator'

const NewsItemList = (props) => {
  const { newsItems, isLoading } = props
  return (
    <Fragment>
      {isLoading('newsItems') && (
        <LoadingIndicator className="overlay bg-white-70" />
      )}
      <div className="flex-auto overflow-y-auto relative">
        {newsItems
          .reverse()
          .map((newsItem) => (
            <NewsItemListItemAnimated
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
