import React, { Component } from 'react'
import Article from '../components/Article'

export default class ArticleList extends Component {
  render() {
    const { articles, tags } = this.props
    return (
      <div>
        {articles &&
          articles
            .valueSeq()
            .map((article) => (
              <Article article={article} tags={tags} key={article.get('id')} />
            ))}
      </div>
    )
  }
}
