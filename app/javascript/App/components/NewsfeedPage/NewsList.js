import React, { Fragment } from 'react'
import NewsListItemAnimated from './NewsListItemAnimated'
import LoadingIndicator from '../LoadingIndicator'

const NewsList = (props) => {
  const { newsItems, isLoading } = props
  return (
    <Fragment>
      {isLoading('newsItems') && (
        <LoadingIndicator className="overlay bg-white-70" />
      )}
      <div className="flex-auto overflow-y-auto relative">
        {newsItems.map((newsItem) => (
          <NewsListItemAnimated
            key={newsItem.get('id')}
            {...props}
            newsItem={newsItem}
          />
        ))}
      </div>
    </Fragment>
  )
}

export default NewsList
