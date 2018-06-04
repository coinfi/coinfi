import React, { Component } from 'react'
import timeago from 'timeago.js'
import sanitizeHtml from 'sanitize-html'
import { stringHostname } from '../../lib/urlHelpers'
import _ from 'lodash'

export default class NewsItemBody extends Component {
  render() {
    const {
      selectNewsItemFromList,
      selectNewsItemCoins,
      activeEntity
    } = this.props
    const { id } = activeEntity
    const newsItem = selectNewsItemFromList(id)
    if (!newsItem) return null
    const coins = selectNewsItemCoins(newsItem)
    const content = _.trim(newsItem.get('content')) || _.trim(newsItem.get('summary'))
    return (
      <div className="pa4">
        {coins.size > 0 && (
          <div className="mb3">
            {coins.map((tag, index) => (
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
        <hr />
        <div dangerouslySetInnerHTML={{__html: sanitizeHtml(content)}}></div>
      </div>
    )
  }
}
