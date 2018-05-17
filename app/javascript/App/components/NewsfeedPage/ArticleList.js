import React, { Component } from 'react'
import ArticleListItem from './ArticleListItem'

export default class ArticleList extends Component {
  render() {
    const { articles } = this.props
    return (
      <div>
        {articles &&
          articles
            .valueSeq()
            .map((article) => (
              <ArticleListItem
                key={article.get('id')}
                article={article}
                {...this.props}
              />
            ))}
      </div>
    )
  }
}
