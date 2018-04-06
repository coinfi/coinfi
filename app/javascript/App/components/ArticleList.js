import React, { Component } from 'react'
import ArticleFilters from '../components/ArticleFilters'
import Article from '../components/Article'

export default class ArticleList extends Component {
  state = { tab: 'news' }
  tabClick = tab => () => {
    this.setState({ tab })
  }
  render() {
    const { entities } = this.props
    const { articles, tags } = entities.toObject()
    const { tab } = this.state
    return (
      <div>
        <div className="flex justify-between">
          <div className="tabs mb3">
            <button className="tab tab-active" onClick={this.tabClick('news')}>
              Trending News
            </button>
            <button className="tab" onClick={this.tabClick('events')}>
              Event Calendar
            </button>
          </div>
          <ArticleFilters />
        </div>
        {tab === 'news' ? (
          <div>
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
        ) : (
          <div>Event calendar coming soon</div>
        )}
      </div>
    )
  }
}
