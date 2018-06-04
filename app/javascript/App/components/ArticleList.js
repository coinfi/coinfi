import React from 'react'
import ArticleFilters from '../components/ArticleFilters'
import Article from '../components/Article'
import Tabs from '../components/Tabs'

export default props => {
  const { entities } = props
  const { articles, tags } = entities.toObject()
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
          {articles &&
            articles
              .valueSeq()
              .map(article => (
                <Article
                  article={article}
                  tags={tags}
                  key={article.get('id')}
                />
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
