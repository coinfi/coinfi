import React, { Component } from 'react'

export default class Article extends Component {
  render() {
    const { selectArticle, id } = this.props
    const article = selectArticle(id)
    return (
      <div>
        <h1>{article.get('title')}</h1>
        <div>{article.get('summary')}</div>
      </div>
    )
  }
}
