import React, { Component } from 'react'
import timeago from 'timeago.js'
import sanitizeHtml from 'sanitize-html'
import _ from 'lodash'
import NewsCoinTags from './NewsCoinTags'
import Icon from '../Icon'
import URL from 'url-parse'

export default class NewsBody extends Component {

  componentDidMount() {
    twttr.widgets.createTweet(
      this.props.activeEntity.tweetId,
      document.getElementById('container'),
      {
        theme: 'light'
      }
    )
  }

  render() {
    const {
      selectNewsItemFromList,
      activeEntity,
      selectNewsCategories
    } = this.props
    const { id, tweetId } = activeEntity
    const newsItem = selectNewsItemFromList(id)
    if (!newsItem) {
      return null
    }
    const categories = selectNewsCategories(newsItem)
    const content = _.trim(newsItem.get('content')) || _.trim(newsItem.get('summary'))
    const url = new URL(newsItem.get('url'))

    if ([].slice.call([document.getElementById('container')]).length) {
      $('#container').empty()
      twttr.widgets.createTweet(
        this.props.activeEntity.tweetId,
        document.getElementById('container'),
        {
          theme: 'light'
        }
      )
    }

    return (
      <div className="pa4 bg-white min-h-100">
        <NewsCoinTags newsItem={newsItem} />
        <div id="container"></div>

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
