import React, { Component } from 'react'
import timeago from 'timeago.js'
import { stringHostname } from '../../lib/urlHelpers'

export default class NewsItemBody extends Component {
  render() {
    const {
      selectNewsItemFromList,
      selectNewsItemTags,
      activeEntity
    } = this.props
    const { id } = activeEntity
    const newsItem = selectNewsItemFromList(id)
    const tags = selectNewsItemTags(newsItem)
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
        <h1>{newsItem.get('title')}</h1>
        <div className="mb3">
          <span className="mr3">
            {timeago().format(newsItem.get('published_date'))}
          </span>
          <a href={newsItem.get('url')} target="_blank">
            {stringHostname(newsItem.get('url'))}
          </a>
        </div>
        <div>{newsItem.get('summary')}</div>
      </div>
    )
  }
}
