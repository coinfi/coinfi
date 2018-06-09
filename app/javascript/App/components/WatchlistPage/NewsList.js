import React from 'react'
import NewsFilters from './NewsFilters'
import NewsListItem from './NewsListItem'
import Tabs from '../Tabs'

export default (props) => {
  const { newsItems } = props
  return (
    <div>
      <div className="flex justify-between items-end flex-wrap mb4 ph3 ph0-l">
        <Tabs
          target="news-items"
          items={['Trending News', 'Event Calendar']}
          className="flex-auto justify-center justify-start-l"
        />
        <NewsFilters />
      </div>
      <div id="news-items" className="pt1 ph1 bg-athens-dark bg-white-m">
        <div className="tab-content active">
          {newsItems.map((newsItem, index) => (
            <NewsListItem {...props} newsItem={newsItem} key={index} />
          ))}
          {(!newsItems || newsItems.size === 0) && (
            <div className="pt2 o-60">Add items to see news here</div>
          )}
        </div>
        <div className="tab-content">Event calendar coming soon</div>
      </div>
    </div>
  )
}
