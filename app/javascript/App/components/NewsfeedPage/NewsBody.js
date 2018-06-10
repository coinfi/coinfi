import React, { Component } from 'react'
import timeago from 'timeago.js'
import sanitizeHtml from 'sanitize-html'
import _ from 'lodash'
import { stringHostname } from '../../lib/urlHelpers'
import NewsCoinTags from './NewsCoinTags'
import Icon from '../Icon'

export default class NewsBody extends Component {
  closeModal = (toggleUI) => {
    toggleUI('newsfeedModal', { toggleBodyScroll: window.isMobile })
  }
  render() {
    const {
      selectNewsItemFromList,
      activeEntity,
      selectNewsCategories,
      mobileLayout,
      toggleUI
    } = this.props
    const { id } = activeEntity
    const newsItem = selectNewsItemFromList(id)
    const categories = selectNewsCategories(newsItem)
    if (!newsItem) return null
    const content =
      _.trim(newsItem.get('content')) || _.trim(newsItem.get('summary'))
    return (
      <div className="pa4" style={mobileLayout ? { background: '#fff' } : {}}>
        <Icon
          name="times"
          className="fr"
          onClick={this.closeModal.bind(this, toggleUI)}
        />
        <NewsCoinTags newsItem={newsItem} {...this.props} />
        <h1 style={{ wordBreak:'break-word' }}>{newsItem.get('title')}</h1>
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
