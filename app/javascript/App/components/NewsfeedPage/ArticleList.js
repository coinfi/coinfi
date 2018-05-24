import React, { Component } from 'react'
import ArticleListItem from './ArticleListItem'

export default class ArticleList extends Component {
  render() {
    const { articles } = this.props
    return (
      <div>
        {articles.map((article) => (
          <ArticleListItem
            key={article.get('id')}
            {...this.props}
            article={article}
          />
        ))}
      </div>
    )
  }
}
