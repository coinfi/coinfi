import React from 'react'
import ArticleFilters from './ArticleFilters'
import ArticleListItem from './ArticleListItem'
import Tabs from '../Tabs'

export default (props) => {
  const { articles } = props
  return (
    <div>
      <div className="flex justify-between items-end flex-wrap mb4 ph3 ph0-l">
        <Tabs
          target="article-list"
          items={['Trending News', 'Event Calendar']}
          className="flex-auto justify-center justify-start-l"
        />
        <ArticleFilters />
      </div>
      <div id="article-list" className="pt1 ph1 bg-athens-dark bg-white-m">
        <div className="tab-content active">
          {articles.map((article, index) => (
            <ArticleListItem {...props} article={article} key={index} />
          ))}
          {(!articles || articles.size === 0) && (
            <div className="pt2 o-60">Add items to see news here</div>
          )}
        </div>
        <div className="tab-content">Event calendar coming soon</div>
      </div>
    </div>
  )
}
