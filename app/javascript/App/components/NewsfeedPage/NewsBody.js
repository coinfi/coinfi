import React, { Component } from 'react'
import timeago from 'timeago.js'
import sanitizeHtml from 'sanitize-html'
import _ from 'lodash'
import NewsCoinTags from './NewsCoinTags'
import Icon from '../Icon'
import URL from 'url-parse'

export default class NewsBody extends Component {
  render() {
    const {
      selectNewsItemFromList,
      activeEntity,
      selectNewsCategories
    } = this.props
    const { id } = activeEntity
    const newsItem = selectNewsItemFromList(id)
    if (!newsItem) {
      return null
    }
    const categories = selectNewsCategories(newsItem)
    const content = _.trim(newsItem.get('content')) || _.trim(newsItem.get('summary'))
    const url = new URL(newsItem.get('url'))
    return (
      <div className="pa4 bg-white min-h-100">
        <NewsCoinTags newsItem={newsItem} />
        <h1 className="break-word f3">{newsItem.get('title')}</h1>
        <div className="pb4 mb4 b--b">
          <span className="mr4">
            <Icon name="clock" className="mr2 f7" regular />
            {timeago().format(newsItem.get('published_date'))}
          </span>
          <a href={newsItem.get('url')} target="_blank" rel="nofollow">
            <Icon name="link" className="mr2 f7" regular />
            {url.hostname}
          </a>
        </div>
        <div
          className="lh-copy"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />
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
