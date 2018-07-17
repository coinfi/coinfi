import React, { Component } from 'react'
import timeago from 'timeago.js'
import sanitizeHtml from 'sanitize-html'
import _ from 'lodash'
import NewsCoinTags from './NewsCoinTags'
import Icon from '../Icon'

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
    return (
      <div className="pa4 bg-white min-h-100 selected-news-content">
        <NewsCoinTags newsItem={newsItem} />
        <h1 className="break-word f3">{newsItem.get('title')}</h1>
        <div className="mb3">
          <a href={newsItem.get('url')} target="_blank" rel="nofollow" style={{wordBreak: "break-all"}}>
            <Icon name="link" className="mr1 f7" regular />
            {newsItem.get('url')}
          </a>
        </div>
        <div className="mb3">
          <Icon name="clock" className="mr1 f7" regular />
          {timeago().format(newsItem.get('feed_item_published_at'))}
          <span className="ph2" style={{fontSize: 8}}>&bull;</span>
          <span>{new Date(newsItem.get('feed_item_published_at')).toLocaleString()}</span>
        </div>
        {categories.size > 0 && (
          <div className="mv3">
            {categories.map((category, index) => (
              <div key={index} className="tag-alt">
                {category.get('name')}
              </div>
            ))}
          </div>
        )}
        <div className="mv3 b--b"></div>
        <div
          className="lh-copy"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(content, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
            })
          }}
        />
      </div>
    )
  }
}
