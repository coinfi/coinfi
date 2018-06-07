import React, { Component } from 'react'
import timeago from 'timeago.js'
import sanitizeHtml from 'sanitize-html'
import { stringHostname } from '../../lib/urlHelpers'
import _ from 'lodash'
import NewsItemCoinTags from './NewsItemCoinTags'

export default class NewsItemBody extends Component {
  render() {
    const {
      selectNewsItemFromList,
      activeEntity,
      unsetActiveEntity,
      selectNewsItemCategories,
      mobileLayout
    } = this.props
    const { id } = activeEntity
    const newsItem = selectNewsItemFromList(id)
    const categories = selectNewsItemCategories(newsItem)
    if (!newsItem) return null
    const content =
      _.trim(newsItem.get('content')) || _.trim(newsItem.get('summary'))
    return (
      <div className="pa4" style={mobileLayout ? {background:'#fff'} : {}}>
        <div onClick={unsetActiveEntity}>close</div>
        <NewsItemCoinTags newsItem={newsItem} />
        <h1>{newsItem.get('title')}</h1>
        <div className="mb3">
          <span className="mr3">
            {timeago().format(newsItem.get('published_date'))}
          </span>
          <a href={newsItem.get('url')} target="_blank" rel="nofollow">
            {stringHostname(newsItem.get('url'))}
          </a>
        </div>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
        {categories.size > 0 && (
          <div className="mt3">
            {categories.map((category, index) => (
              <div key={index} className="tag-alt">
                {category.get('name')}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}
