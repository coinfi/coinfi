import React, { Component } from 'react'
import timeago from 'timeago.js'
import { stringHostname } from '../../lib/urlHelpers'

export default class ArticleBody extends Component {
  render() {
    const {
      selectArticleFromList,
      selectArticleTags,
      activeEntity
    } = this.props
    const { id } = activeEntity
    const article = selectArticleFromList(id)
    const tags = selectArticleTags(article)
    return (
      <div className="pa4">
        {tags.size > 0 && (
          <div className="mb3">
            {tags.map((tag, index) => (
              <div key={index} className="tag">
                {tag.get('name')}
              </div>
            ))}
          </div>
        )}
        <h1>{article.get('title')}</h1>
        <div className="mb3">
          <span className="mr3">
            {timeago().format(article.get('published_date'))}
          </span>
          <a href={article.get('url')} target="_blank">
            {stringHostname(article.get('url'))}
          </a>
        </div>
        <div>{article.get('summary')}</div>
      </div>
    )
  }
}
